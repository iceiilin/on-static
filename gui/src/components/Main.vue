<template>
    <div class="container">
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <a class="navbar-brand" href="#" style="color: white">on-static web ui</a>
        </nav>

    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-primary">
                <div class="panel-heading">
                    <h3 class="panel-title">On-Static Host Settings</h3>
                </div>
                <div class="input-group">
                        <label class="input-group-addon">IP address</label>
                        <input class="form-control"type="text" v-model.trim="hostIpAddr" @change="hostChanged">
                        <label class="input-group-addon">port</label>
                        <input class="form-control"type="text" v-model.number="hostPort" @change="hostChanged">
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <ImageManagementTable
                title="Image File Management"
                :baseUrl="baseUrl"
                imageUploadUrl="images?"
                imageDeleteUrl="images?"
                imageListUrl="images"
                :supportedFileTypes="['.iso']"
            >
            </ImageManagementTable>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <FileManagementTable
                title="ISO File Management"
                :baseUrl="baseUrl"
                fileUploadUrl="iso?name="
                fileDeleteUrl="iso?name="
                fileListUrl="iso"
                :supportedFileTypes="['.iso']"
            >
            </FileManagementTable>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <FileManagementTable
                title="MicroKernel File Management"
                :baseUrl="baseUrl"
                fileUploadUrl="microkernel?name="
                fileDeleteUrl="microkernel?name="
                fileListUrl="microkernel"
                :supportedFileTypes="['*']"
            >
            </FileManagementTable>
        </div>
    </div>
</div>

</template>

<script>
    import { alert } from 'vue-strap';

    import FileManagementTable from './FileManagementTable';
    import ImageManagementTable from './ImageManagementTable';

    import StaticRequester from 'common-src/StaticRequester';

    import 'bootstrap';

    import debounce from 'debounce';

    export default {
        name: 'main',
        components: {
            FileManagementTable: FileManagementTable,
            ImageManagementTable: ImageManagementTable,
            Alert: alert
        },
        methods: {
            getIsos: function () {
                var self = this;

                self.$ = new StaticRequester(this.baseUrl);

                return self.$.getIsos()
                    .then((response) => {
                        console.log('Iso file list: ', response.data);
                        self.isos = response.data;
                        return response.data;
                    })
                    .catch((err) => {
                        console.log('Get ISO request failed: ', baseUrl)
                        console.log('err', err)
                    })
            },
            // hostChanged: function(){
            //     console.log('host changed', this.baseUrl);
            // },
            hostChanged: debounce(function(){
                this.baseUrl = "http://" + this.hostIpAddr + ":" + this.hostPort + '/';
            }, 500)
        },
        mounted: function () {
            var self = this;
            self.getIsos();
            // setInterval(function(){
            //     self.getIsos();
            // }, 3000);
        },
        computed: {
            isoKeys: function () {
                console.log(this.isos);
                console.log(this.isos.length, typeof this.isos)
                if (this.isos.length === 0) {
                    return []
                } else {
                    return Object.keys(this.isos[0]);
                }
            }
            // baseUrl: function(){
            //     return "http://" + this.hostIpAddr + ":" + this.hostPort + '/';
            // }
        },
        data: function () {
            return {
                isos: [{ size: 100, name: 'test' }],
                hostIpAddr: "10.62.59.150",
                hostPort: "7070",
                baseUrl: "http://10.62.59.150:7070/"
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    </style>
