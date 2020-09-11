<template>
    <v-card :class="{star:task.star, 'mayBeFinish':hasProjectManager}" class="starDisabled">
        <v-card-title class="pa-0">
            <v-textarea class="pa-2 textarea" :class="{editName:edit_name}" color="red"
                        :background-color="edit_name_background" rows="1" solo flat auto-grow :disabled="!edit_name"
                        v-model="task_name"></v-textarea>
        </v-card-title>
        <v-card-text>
            <v-expand-transition>
                <div v-if="taskDetails">
                    <div v-if="taskUserList">
                        <div v-for="i in taskUserList" :key="i.id">
                            <router-link style="text-decoration: none; color: black" :to="`/user/${i.id}`">
                                {{i|name}}
                            </router-link>
                        </div>
                    </div>
                    <div v-else>
                        None user assigned
                    </div>
                    <div class="mt-5">
                        <v-autocomplete
                                v-model="value"
                                :items="users"
                                :item-value="item => item"
                                :item-text="item => `${item.first_name}  ${item.last_name}`"
                                dense
                                filled
                                label="Pick user"
                                :error-messages="selectError"
                        >
                        </v-autocomplete>
                        <div class="row justify-center mt-2 mb-3">
                            <v-btn @click="addUser()" class="mt-2">Add User</v-btn>
                        </div>
                    </div>
                </div>

            </v-expand-transition>

            <div class="row d-flex justify-space-between align-center">
                <span>{{task.date|date}} </span>
                <div>
                    <v-btn @click="editName" icon>
                        <v-icon>mdi-file-document-edit-outline</v-icon>
                    </v-btn>
                    <v-btn @click="starOnOff" icon>
                        <v-icon>mdi-star-outline</v-icon>
                    </v-btn>
                    <v-btn @click="showTaskDetails" icon>
                        <v-icon v-if="taskDetails">mdi-chevron-up</v-icon>
                        <v-icon v-else>mdi-chevron-down</v-icon>
                    </v-btn>
                </div>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import state from '@/store'

    export default {
        name: 'Task',

        props: ['task'],

        data() {
            return {
                items: ['foo', 'bar', 'fizz', 'buzz'],
                value: null,

                autoGrowHack: false,
                task_name: this.$props.task.name,
                edit_name: false,
                edit_name_background: 'white',
                taskDetails: false,
                taskUserList: null,
                selectError: null,
                addUserText: '',
                addUserList: false,
            }
        },

        computed: {
            users() {
                const userList = state.getters.getUsersWithJob
                const removeAssignedUser = userList.filter(u => {
                    return this.taskUserList.indexOf(u) === -1;
                })

                return removeAssignedUser
            },

            hasProjectManager() {
                let users = state.getters.getUsers
                if (!users) return null

                let id = this.$props.task.users

                for (let i in id) {
                    if (users.find(u => u.job_title === "Project Manager" && u.id === parseInt(id[i]))) return true
                }

                return false
            }
        },

        mounted() {
            this.init()
        },

        methods: {
            starOnOff() {
                this.$props.task.star = !this.$props.task.star
            },

            editName() {
                if (!this.edit_name) {
                    this.edit_name_background = '#eeeeee'
                    this.edit_name = !this.edit_name
                } else {
                    this.edit_name_background = 'white'
                    this.edit_name = !this.edit_name
                }
            },

            showTaskDetails() {
                this.taskDetails = !this.taskDetails
            },

            async init() {
                await state.dispatch('downloadUsers')
                await state.dispatch('getUserToTask', this.$props['task'].users).then(r => {
                    this.taskUserList = r
                })
            },

            addUser() {
                if (!this.value) {
                    this.selectError = "Pick user first"
                    return false
                }
                const id = this.value.id
                this.selectError = null
                state.commit('addUserToTask', {user: id, task: this.$props.task})
                this.taskUserList.push(state.getters.getDetailsUser(id))
                this.addUserText = ''
                this.value = null
            }
        },

        filters: {
            date: function (value) {
                const date = new Date(value)

                let day = date.getDate()
                let month = date.getMonth() + 1
                const year = date.getFullYear()

                if (month < 10) month = `0${month}`
                if (day < 10) day = `0${day}`

                const hours = date.getHours()
                const minutes = date.getMinutes()

                return `${year}-${month}-${day} ${hours}:${minutes}`
            },

            name: function ({first_name, last_name}) {
                return `${first_name} ${last_name}`
            },
        },

    }
</script>

<style lang="scss">
    .v-btn {
        outline: none !important;
    }

    .list-group-item {
        background-color: transparent;
        border: none;
    }

    .addUser {
        color: black !important;
    }

    .star {
        border-left: 3px solid red !important;
    }

    textarea:disabled {
        color: black !important;
    }

    .starDisabled {
        .textarea {
            font-size: 20px;
            font-weight: initial;

            hyphens: none;
            -moz-hyphens: none;
            -webkit-hyphens: none;
            -ms-hyphens: none;

            .v-text-field__details {
                display: none;
            }
        }


        border-left: 3px solid white;
    }
</style>
