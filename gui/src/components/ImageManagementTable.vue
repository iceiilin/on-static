<!-- Copyright 2016, EMC, Inc. -->

<template>
    <div class="panel panel-primary">
        <div class="panel-heading">
            <h3 class="panel-title">{{ title }}
                <button type="button" class="btn btn-primary btn-xs btn-transparent" @click="getImages">
                    <span class="glyphicon glyphicon-refresh"></span>
                </button>
            </h3>
        </div>

        <ResourceTable :headerItems="fileKeys" :bodyItems="files" @removeRow="removeImage"></ResourceTable>

        <button type="button" class="btn btn-success btn-block" @click="clickAddImage">
            <span v-if="!showImageAdd" class="glyphicon glyphicon-plus-sign"></span>
            <span v-else class="glyphicon glyphicon-minus-sign"></span>
        </button>
        
        <form class="form-inline" v-show="showImageAdd" >
            <div class="form-group">
                <label>
                    name
                </label>
                <input v-model="osName" class="form-control" type="text" placeholder="ubuntu">
                <label>
                    version
                </label>
                <input v-model="osVersion" class="form-control" type="text" placeholder="trusty">
            </div>
            <label>
                use ISO file from:
            </label>
            <div class="form-group btn-group">
                <button type="button" class="btn btn-default" autofocus="true" @click="setSourceToStore">store</button>
                <button type="button" class="btn btn-default" @click="setSourceToWeb">web link</button>
                <button type="button" class="btn btn-default" @click="setSourceToClient">local file</button>
            </div>
            <input v-if="isoSource === 'isostore'" v-model="inStoreIso" class="form-control" type="text" placeholder="speicify your iso file">
            <input v-if="isoSource === 'isoweb'" v-model="webLinkIso" class="form-control" type="text" placeholder="http://old-releases.ubuntu.com/releases/14.04.0/ubuntu-14.04-server-amd64.iso">
            <div v-if="isoSource === 'isoclient'" class="input-group">
                <label id="file-browse" class="input-group-addon">
                    Browse...<input id="fileUploadInput" @change="fileSelected" type="file" style="display: none">
                </label>
                <input type="text" :value="selectedFileName" class="form-control" disabled placeholder="iso file name">
            </div>
        </form>
        <div class="" v-show="uploadStarted && showImageAdd">
            <div class="progress-bar progress-bar-striped" :class="{active: uploadIsActive}" role="progressbar" :style="progressbarWidth">
                {{ uploadProgress + "%"}}
            </div>
        </div>
        <div v-show="showImageAdd">
            <button v-if="isoSource === 'isostore' || isoSource === 'isoweb'" @click="requestAddNewImage(false)" type="button" class="btn btn-success btn-block">
                <span class="glyphicon glyphicon-ok"></span>
            </button>
            <button v-else-if="isoSource === 'isoclient' && !uploadIsActive" @click="uploadFile" :disabled="disableFileUploadButton" type="button" class="btn btn-success btn-block">
                <span class="glyphicon glyphicon-ok"></span>
            </button>
            <button v-else-if="isoSource === 'isoclient' && uploadIsActive" @click="stopUpload" :disabled="disableFileUploadButton" type="button" class="btn btn-default btn-block">
                <span id="stopUpload" class="glyphicon glyphicon-remove"></span>
            </button>
        </div>
    </div>
</template>

<script>
    import 'bootstrap';

    import ResourceTable from './Table';
    import FileUploader from './FileUploader';

    // import { dropdown } from 'vue-strap';
    // import dropdownSelect from 'vuestrap-base-components/src/components/dropdown-select';
    // import { dropdownSelect } from 'bootstrap-vue';
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    // import dropdown from 'vue-strap/src/dropdown';
    // import dropdown from 'vue-strap/src/dropdown';
    Vue.use(BootstrapVue);

    import Requester from 'common-src/Requester';


    export default {
        name: 'FileTable',
        props: {
            title: {
                type: String,
                default: "File Management"
            },
            supportedFileTypes: {
                type: Array,
                default: function(){
                    return ['*']
                }
            },
            baseUrl: {
                type: String,
                default: 'http://0.0.0.0:7070/'
            },
            imageUploadUrl: {
                type: String,
                default: ''
            },
            imageDeleteUrl: {
                type: String,
                default: ''
            },
            imageListUrl: {
                type: String,
                default: 'iso'
            },
            supportedFiles: {
                type: Array,
                default: function(){
                    return ['.iso']
                }
            }
        },
        mounted: function () {

            this.getImages();
        },
        components: {
            ResourceTable: ResourceTable,
            FileUploader: FileUploader
        },
        computed: {
            fileKeys: function () {
                if (this.files.length === 0) {
                    return []
                } else {
                    return Object.keys(this.files[0]);
                }
            },
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
        watch: {
            baseUrl: function(){
                return this.getImages();
            }
        },
        methods: {
            getImages: function () {
                var self = this;

                let $ = new Requester(this.baseUrl);
                return $.get(this.imageListUrl)
                    .then((response) => {
                        self.files = response.data;
                        return response.data;
                    })
                    .catch((err) => {
                        console.log('Get file request failed: ', this.baseUrl)
                        console.log('err', err);
                        self.files = [];
                    })
            },
            removeImage: function (id) {
                var self = this;
                console.log(id);
                console.log(this.files[id]);
                let fileName = this.files[id].name;

                let $ = new Requester(this.baseUrl);
                return $.delete(this.imageDeleteUrl + "id=" + this.files[id]["id"])
                    .then(function () {
                        return self.getImages();
                    })
            },
            stopUpload: function() {
                if(this.xhr){
                    this.xhr.abort();
                    this.uploadProgress = 0;
                }
            },
            addImageFinished: function (target, type) {
                console.log('image add finished');
                console.log(target, target.currentTarget.status);
                if(target.currentTarget.status >= 400){
                    alert(target.currentTarget.statusText + ': ' + target.currentTarget.response);
                } else{
                    return this.getImages();
                }
            },
            clickAddImage: function () {
                this.showImageAdd = !this.showImageAdd;
            },
            setSourceToStore: function() {
                this.isoSource = "isostore";
            },
            setSourceToWeb: function() {
                this.isoSource = "isoweb";
            },
            setSourceToClient: function() {
                this.isoSource = "isoclient";
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

                this.requestAddNewImage(true);
            },
            requestAddNewImage: function(sendFile) {
                let self = this;

                if(! sendFile){
                    self.xhr = new XMLHttpRequest();
                }

                let url = this.baseUrl +
                    this.imageUploadUrl +
                    "name=" + this.osName + "&" +
                    "version=" + this.osVersion + "&" +
                    this.isoSource + "=";

                if(this.isoSource === 'isostore') {
                    url = url + this.inStoreIso.trim();
                } else if(this.isoSource === 'isoweb') {
                    url = url + this.webLinkIso;
                } else if(this.isoSource === 'isoclient'){
                    url = url + this.fileToUpload.name;
                }

                self.xhr.onerror = function(target, type){
                    console.log('xhr errored');
                };

                self.xhr.onload = self.addImageFinished;

                self.xhr.open("PUT", url);
                self.xhr.overrideMimeType(sendFile? "application/octet-stream": "application/json");
                self.xhr.send(sendFile? self.fileToUpload: null);

            },
            fileSelected: function (event) {
                console.log('file selected', event);
                console.log('file selected', event.target.files);
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
                files: [],
                showImageAdd: false,
                disableFileUploadButton: true,
                uploadProgress: 0,
                fileToUpload: {},
                isoSource: "isostore",
                osName: "ubuntu",
                osVersion: "trusty",
                inStoreIso: "",
                webLinkIso: ""
            }
        }
    }

</script>

<style scoped>
h3 {
    text-align: center
}

#file-browse {
    color: blue
}

button {
    text-align: center
}
    </style>
