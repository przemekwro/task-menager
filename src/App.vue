<template>
    <v-app id="app">
        <v-fade-transition mode="out-in">
            <router-view></router-view>
        </v-fade-transition>
    </v-app>
</template>

<script>
    import state from '@/store'

    export default {
        name: 'App',

        components: {},

        methods:{
            async init(){
                await state.dispatch('downloadUsers')
            }
        },

        mounted() {
            this.init()
        }
    }
    ;
</script>
<style>
    .v-btn{
        outline: none;
    }
    #app {
        background-color: rgb(29, 97, 141);
    }
</style>
