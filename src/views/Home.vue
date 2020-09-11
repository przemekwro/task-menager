<template>
    <div class="home">
        <div class="container">
            <div class="row d-flex justify-end">
                <router-link :to="`/user/${user.id}`">
                    <v-btn text color="white">{{user.first_name}} {{user.last_name}}</v-btn>
                </router-link>
                <v-btn @click="logout" text color="white">Logout</v-btn>
            </div>
        </div>
        <div class="d-flex justify-center mt-16 mr-10 ml-10 mb-16" >
                <draggable
                        group="a"
                        :list="category"
                        :disabled="!enabled"
                        class="list-group"
                        ghost-class="ghost"
                        v-bind="dragOptions"
                        @start="drag = true"
                        @end="drag = false">
                    <transition-group class="row" type="transition" :name="!drag ? 'flip-list' : null">
                        <div class="ma-1 category" v-for="i in category" :key="i.id">
                            <TaskCategory :category="i"></TaskCategory>
                        </div>
                    </transition-group>
                </draggable>
        </div>
    </div>
</template>

<script>
    import state from '@/store'
    import TaskCategory from "@/components/TaskCategory";
    import draggable from 'vuedraggable'

    export default {
        name: 'Home',

        components: {
            TaskCategory,
            draggable,
        },

        data() {
            return {
                enabled: true,
                drag: false,
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
            }
        },

        created() {
            this.init()
        },

        computed: {
            dragOptions() {
                return {
                    group: {
                        name: 'category',
                        put: false,
                    },
                    animation: 200,
                    disabled: true,
                    ghostClass: "ghost"
                };
            },

            user() {
                return state.getters.getLoggedUser
            },

            category() {
                return state.getters.getCategory
            }
        },
    }
</script>

<style lang="scss" scoped>
    .home {
        .category{
            min-width: 260px;
            max-width: 260px;
        }
        .v-btn{
            outline: none;
        }
        .v-btn::before {
            background-color: transparent;
        }

        .v-btn:hover {
            text-decoration: underline;
        }

        a {
            text-decoration: none;
        }


        //animacje
        .flip-list-move {
            transition: transform 0.5s;
        }

        .no-move {
            transition: transform 0s;
        }

        .ghost {
            opacity: 0.5;
            background: #c8ebfb;
        }

        .list-group {
            min-height: 20px;
        }

        .list-group-item {
            cursor: move;
        }

        .list-group-item i {
            cursor: pointer;
        }
    }
</style>
