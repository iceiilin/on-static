<!-- Copyright 2016, EMC, Inc. -->

<template>
    <div>
        <div class="input-group">
            <label id="file-browse" class="input-group-addon">
                Browse...<input id="fileUploadInput" @change="fileSelected" type="file" style="display: none">
            </label>
            <input type="text" :value="selectedFileName" class="form-control" disabled placeholder="iso file name">
        </div>

        <div class="" v-show="uploadStarted">
            <div class="progress-bar progress-bar-striped" :class="{active: uploadIsActive}" role="progressbar" :style="progressbarWidth">
                {{ uploadProgress + "%"}}
            </div>
        </div>

        <button v-if="!uploadIsActive" @click="uploadFile" :disabled="disableFileUploadButton" type="button" class="btn btn-success btn-block">
            <span class="glyphicon glyphicon-ok"></span>
        </button>
        <button v-else @click="stopUpload" :disabled="disableFileUploadButton" type="button" class="btn btn-default btn-block">
            <span id="stopUpload" class="glyphicon glyphicon-remove"></span>
        </button>
    </div>
</template>

<script>
    import 'bootstrap';

    import StaticRequester from 'common-src/StaticRequester';

    export default {
        name: 'file-uploader',
        props: {
            baseUrl: {
                type: String,
                default: ""
            },
            fileUploadUrl: {
                type: String,
                default: "iso?name="
            },
            showFileUploadGroup: {
                type: Boolean,
                default: true
            },
            supportedFileTypes: {
                type: Array,
                default: function(){
                    return ['*']
                }
            }
        },
        computed: {
            progressbarWidth: function() {
                return "width: " + this.uploadProgress + "%";
            },
            uploadIsActive: function() {
                if(this.uploadProgress > 0 && this.uploadProgress < 100) {
                    return true;
                } else {
                    return false;
                }
            },
            uploadStarted: function() {
                if(this.uploadProgress > 0 && this.uploadProgress <= 100) {
                    return true;
                } else {
                    return false;
                }
            },
            selectedFileName: function() {
                return this.fileToUpload.name;
            }
        },
        methods: {
            stopUpload: function() {
                if(this.xhr){
                    this.xhr.abort();
                    this.uploadProgress = 0;
                }
            },
            uploadFile: function () {
                var self = this;
                console.log('uploading file');
                var reader = new FileReader();

                self.xhr = new XMLHttpRequest();
                let uploader = self.xhr.upload;

                let fileName = this.fileToUpload.name;
                let uploadedSize = 0;

                uploader.addEventListener('progress', function (event) {
                    uploadedSize = event.loaded;
                    self.uploadProgress = (event.loaded * 100 / event.total).toFixed(1);
                    console.log(uploadedSize, ' has been sent', 'progress: ', self.uploadProgress);
                });

                uploader.addEventListener('load', function (target) {
                    console.log('upload finished');
                    if(target.currentTarget.status >= 400){
                        self.$emit('error', target);
                    }else {
                        self.$emit('finished');
                    }
                });

                self.xhr.open("PUT", this.baseUrl + this.fileUploadUrl + fileName);
                self.xhr.overrideMimeType("application/octet-stream");
                self.xhr.send(self.fileToUpload);
            },
            fileSelected: function (event) {
                let files = event.target.files;

                if (files.length) {
                    let file = files[0];
                    let fileName = file.name;

                    if (this.validateFileType(fileName)) {
                        this.fileToUpload = file;
                        this.disableFileUploadButton = false;
                    } else {
                        alert("please choose iso file which end with", JSON.stringify(this.supportedFileTypes));
                        this.disableFileUploadButton = true;
                    }
                } else {
                    this.disableFileUploadButton = true;
                }
            },
            validateFileType: function(fileName){

                if(this.supportedFileTypes.length === 0){
                    return false;
                }
                
                let validateResult = false;

                this.supportedFileTypes.forEach(function(type){
                    if(type === "*"){
                        validateResult = true;
                    } else if(fileName.indexOf(type) >=0) {
                        validateResult = true;
                    }
                });

                return validateResult;
            }
        },
        data() {
            return {
                disableFileUploadButton: true,
                uploadProgress: 0,
                fileToUpload: {}
            }
        }
    }

</script>

<style scoped>
h3 {
    text-align: center
}

#stopUpload {
    color: red
}

#file-browse {
    color: blue
}

button {
    text-align: center
}
    </style>
