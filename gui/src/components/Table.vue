<!-- Copyright 2016, EMC, Inc. -->

<template>
    <table class="table table-hover table-condensed">
        <thead>
            <tr>
                <th v-for="col in headerItems"> {{ col }} </th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(datarow, index) in bodyItems" :key="index">
                <td v-for="key in Object.keys(datarow)">{{datarow[key]}}</td>
                <td>
                    <button type="button" :id="index" class="btn btn-link btn-sm" @click="removeRow">
                        <span :id="index" class="glyphicon glyphicon-minus-sign"></span>
                        </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import 'bootstrap';

    export default {
        name: 'Table',
        props: {
            headerItems: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            bodyItems: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        methods: {
            removeRow: function (msg) {
                console.log(msg);
                this.$emit('removeRow', msg.target.id);
            }
        },
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
td {
    text-align: left
}
span {
    color: red
    
}
    </style>
