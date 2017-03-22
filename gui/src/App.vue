<template>
    <div id="app">
        <!--<img src="./assets/logo.png">-->
        <MainApp></MainApp>
    </div>
</template>

<script>
    import MainApp from './components/Main'

    export default {
        name: 'app',
        components: {
            MainApp
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: left;
        color: #2c3e50;
        margin-top: 60px;
    }
    </style>