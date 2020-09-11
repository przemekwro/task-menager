<template>
    <div class="home mb-5">
        <div id="menu" class="container">
            <div class="row d-flex justify-end">
                <router-link to="/home">
                    <v-btn text color="white">Home</v-btn>
                </router-link>
                <v-btn @click="logout" text color="white">Logout</v-btn>
            </div>
        </div>
        <div class="container mt-16">
            <v-card v-if="user">
                <v-card class="align-center d-flex justify-center ma-0" elevation="8">
                    <v-card-title>
                        <v-img class="img" :src="user.avatar"></v-img>
                        {{user|name}}
                    </v-card-title>
                </v-card>

                <v-card-text class="mt-5 row">
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
                        <LMap
                                :center="[user.lat, user.lng]"
                                ref="map"
                                :zoom="12">
                            <LTileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    :options="tiles"/>
                            <LMarker
                                    ref="marker"
                                    :latlng="[user.lat, user.lng]"/>
                        </LMap>
                    </div>
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
                        <UserDetailsInformation :user="user"></UserDetailsInformation>

                    </div>
                </v-card-text>
                <UserListTask class="mt-3"></UserListTask>
            </v-card>
        </div>
    </div>
</template>

<script>
    import state from '@/store'
    import UserListTask from "@/components/UserListTask";
    import UserDetailsInformation from "@/components/UserDetailsInformation";


    export default {
        name: 'Home',

        components: {
            UserListTask,
            UserDetailsInformation,
        },

        data() {
            return {
                user: null,
                asd: this.$route.params.id,
                mapCenter: true,
                tiles: {
                    name: 'OSM France',
                    maxZoom: 20,
                },
            }
        },

        methods: {
            logout() {
                state.commit('logout')
                this.$router.push('/')
            },


            async init() {
                if (!state.getters.getLoaded) {
                    await state.dispatch('downloadUsers')
                }
                this.user = state.getters.getDetailsUser(this.$route.params.id)
            }
        },

        filters: {
            name: function ({first_name, last_name}) {
                return `${first_name} ${last_name}`
            }
        },

        mounted() {
            this.init()
        },

        computed: {},
    }
</script>

<style lang="scss" scoped>
    .home {
        .v-btn::before {
            background-color: transparent;
        }

        .v-btn:hover {
            text-decoration: underline;
        }
        .v-btn{
            outline: none;
        }

        a {
            text-decoration: none;
        }

        p {
            font-size: 20px;
        }

        .top {
            border-radius: 0px;
        }

        .content {
            color: black;
        }

        .img {
            max-width: 50px;
            max-height: 50px;
            background-color: #c9c9c9;
            border-radius: 50px !important;
        }
    }
</style>
