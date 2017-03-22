<template>
</template>

<script>
    import FileManagementTable from './FileManagementTable';

    export default {
        name: 'IsoTable',
        props: {
            title: {
                type: String,
                default: "ISO File Management"
            }
        },
        mounted: function () {
            this.$ = new StaticRequester(this.baseUrl);

            this.getIsos();
        },
        components: {
            ResourceTable: ResourceTable,
            FileUploader: FileUploader
        },
        computed: {
            isoKeys: function () {
                if (this.isos.length === 0) {
                    return []
                } else {
                    return Object.keys(this.isos[0]);
                }
            }
        },
        methods: {
            getIsos: function () {
                var self = this;

                return self.$.getIsos()
                    .then((response) => {
                        console.log('Iso file list: ', response.data);
                        self.isos = response.data;
                        return response.data;
                    })
                    .catch((err) => {
                        console.log('Get ISO request failed: ', this.baseUrl)
                        console.log('err', err)
                    })
            },
            removeIso: function (id) {
                var self = this;
                console.log(id);
                console.log(this.isos[id]);
                let isoName = this.isos[id].name;

                return self.$.deleteIso(isoName)
                    .then(function () {
                        return self.getIsos();
                    })
            },
            uploadFinished: function () {
                this.getIsos();
            },
            clickAddIso: function () {
                this.showIsoUpload = !this.showIsoUpload

                // if(this.showIsoUpload){
                //     document.getElementById("isoUpload").click();
                // }
            }
        },
        data() {
            return {
                isos: [],
                showIsoUpload: false,
                disableFileUploadButton: true,
                fileToUpload: {},
                baseUrl: 'http://10.62.59.150:7070'
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