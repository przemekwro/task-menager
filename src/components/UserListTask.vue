<template>
    <v-card class="pa-5" elevation="20">
        <div class="mb-5">
            <div class="d-flex justify-space-between">
                <h2>User Task</h2>
                <div>
                    <v-btn-toggle mandatory>
                        <v-btn @click="sortByDateDecreasing">
                            <v-icon>mdi-sort-calendar-ascending</v-icon>
                        </v-btn>
                        <v-btn @click="sortByDateIncreasing">
                            <v-icon>mdi-sort-calendar-descending</v-icon>
                        </v-btn>
                        <v-btn @click="sortByNameDecreasing">
                            <v-icon>mdi-sort-alphabetical-ascending</v-icon>
                        </v-btn>
                        <v-btn @click="sortByNameIncreasing">
                            <v-icon>mdi-sort-alphabetical-descending</v-icon>

                        </v-btn>
                    </v-btn-toggle>
                </div>
            </div>
            <transition-group name="flip-list">
                <v-card class="mt-2" elevation="10" v-for="(task,index) in sortedList" :key="task.id">
                    <div class="container row d-flex justify-space-between pa-6">
                        <div>
                            {{index+1}}
                        </div>
                        <div>
                            {{task.name}}
                        </div>
                        <div>
                            {{task.date|date}}
                        </div>
                    </div>
                </v-card>
            </transition-group>
        </div>
    </v-card>
</template>

<script>
    import state from '@/store'

    export default {
        name: 'UserListTask',

        data() {
            return {
                sortedList: null,
            }
        },

        computed: {
            tasks() {
                return state.getters.getTaskToUser(this.$route.params.id)
            }
        },

        mounted() {
            this.sortByNameDecreasing()
        },

        methods: {
            sortByDateDecreasing() {
                let list = this.tasks

                this.sortedList = list.sort((a, b) => {
                    return b.date - a.date
                })
            },
            sortByDateIncreasing() {
                let list = this.tasks

                this.sortedList = list.sort((a, b) => {
                    return a.date - b.date
                })
            },
            sortByNameDecreasing() {
                let list = this.tasks
                console.log(list[0] > list[1])

                this.sortedList = list.sort((a, b) => {
                    if (a.name > b.name) return 1
                    if (b.name > a.name) return -1
                    return 0
                })
            },
            sortByNameIncreasing() {
                let list = this.tasks
                console.log(list[0] > list[1])

                this.sortedList = list.sort((a, b) => {
                    if (a.name < b.name) return 1
                    if (b.name < a.name) return -1
                    return 0
                })
            },
        },

        filters: {
            date: function (value) {
                const date = new Date(value)

                let day = date.getDate() > 10 ? date.getDate() : `0${date.getDate()}`
                let month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : `0${date.getMonth()}`
                const year = date.getFullYear()

                let hours = date.getHours() > 10 ? date.getHours() : `0${date.getHours()}`
                let minutes = date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`

                return `${year}-${month}-${day} ${hours}:${minutes}`
            },
        },

    }
</script>

<style lang="scss">
    .flip-list-move {
        transition: transform 1s;
    }
</style>
