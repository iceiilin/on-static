<template>
    <div class="container">
        <nav class="navbar navbar-inverse navbar-fixed-top" style="background-color: #000000">
<a class="navbar-brand" href="#" style="color: white">on-static web ui</a>
</nav>

<div class='container'>
    <div class="row">
        <div class="col-md-12">
            <table class="table">
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
        </div>
        <a>iso</a>
    </div>
    <div class="row">
        <div class="col-md-12">
        </div>
        <a>microkernel</a>
    </div>
</div>
</div>

</template>

<script>

    import { alert } from 'vue-strap'

    import 'bootstrap';

    export default {
        name: 'hello',
        components: {
            Alert: alert
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
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
    </style>
