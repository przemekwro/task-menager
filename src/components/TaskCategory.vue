<template>
    <v-card>
        <v-card class="card_top shadow-lg d-flex justify-center bg-white rounded container" rounded="0"
                elevation="3">
            <h3>{{category.name}}</h3>
        </v-card>
            <div class=" pt-5 pb-8 card_content">
                <draggable
                        :id="category.name"
                        :list="category.tasks"
                        class="list-group"
                        ghost-class="ghost"
                        v-bind="dragOptions"
                        @start="drag = true"
                        @end="drag = false">
                    <div class="list-group-item item pa-3 pb-0" :id="category.name" v-for="element in category.tasks"
                         :key="element.id">
                        <Task :task="element"></Task>
                    </div>
                </draggable>
            </div>
        <v-card elevation="24" class="card_bottom d-flex justify-center pa-3">
            <div v-if="!newTaskWindow">
                <v-btn @click="openNewTask" icon>
                    <v-icon color="rgb(35,52,105)">mdi-plus</v-icon>
                </v-btn>
            </div>
            <div v-else>
                <div class="pa-2">
                    <v-textarea class="textarea" background-color="#eee"
                                rows="1" solo flat auto-grow placeholder="New task"
                                v-model="newTask.name" :error-messages="error"></v-textarea>
                    <v-autocomplete
                            v-model="value"
                            :items="users"
                            :item-value="item => item"
                            :item-text="item => `${item.first_name}  ${item.last_name}`"
                            dense
                            filled
                            label="Pick user"
                            :error-messages="selectError">
                    </v-autocomplete>
                    <div class="row justify-center mt-2 mb-3">
                        <v-btn @click="addUser()" class="mt-2">Add User</v-btn>
                    </div>
                    <div>
                        <div v-for="u in newTaskUsers" :key="`${u.id}/${newTask.name}`">
                            {{u|name}}
                        </div>
                    </div>
                </div>
                <div class="row d-flex justify-space-around">
                    <v-btn @click="saveNewTask" icon>
                        <v-icon color="#0b6623">mdi-check-circle</v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon @click="closeNewTask" color="red">mdi-close-circle</v-icon>
                    </v-btn>
                </div>
            </div>
        </v-card>
    </v-card>
</template>

<script>
    import draggable from "vuedraggable";
    import Task from "@/components/Task";
    import state from "@/store"

    export default {
        name: "TaskCategory",
        props: ['category'],
        components: {
            Task,
            draggable
        },
        data() {
            return {
                newTaskWindow: false,
                drag: false,
                newTaskUsers: [],
                value: null,
                error: null,
                selectError: null,
                newTask: {
                    name: '',
                    date: null,
                    users: [],
                    id: -1,
                    star: false,
                },
            };
        },
        methods: {
            openNewTask() {
                this.newTaskWindow = true
            },

            closeNewTask() {
                this.newTask = {
                    name: '',
                    date: null,
                    users: [],
                    id: -1,
                    star: false,
                }
                this.value = null
                this.newTaskUsers = []
                this.newTaskWindow = false
                this.error = null
                this.selectError = null
            },

            addUser() {
                if (!this.value) {
                    this.selectError = "Pick user first"
                    return false
                }
                this.selectError = null
                this.newTask.users.push(this.value.id)
                this.newTaskUsers.push(state.getters.getDetailsUser(this.value.id))
                this.value = null
            },

            saveNewTask() {
                const newTask = this.newTask

                if (newTask.name.length < 3) {
                    this.error = 'Please name task'
                    return false
                }


                newTask.date = Date.now()

                state.dispatch('addTask', {category: this.$props['category'], task: newTask})

                this.closeNewTask()

            },
        },

        computed: {
            dragOptions() {
                return {
                    animation: 200,
                    group: {
                        name: "b",
                        put: function (to, from, el) {
                            if (from.options.group.name !== to.options.group.name) {
                                return false
                            }

                            if (to.el.id !== 'Zakończone') {
                                return true
                            }

                            let element = el.children[0].classList
                            if (element.contains('mayBeFinish')) {
                                return true
                            }

                            return false
                        }
                    },
                    disabled: false,
                    ghostClass: "ghost"
                }
            },

            users() {
                const userList = state.getters.getUsersWithJob

                const usersAssigned = this.newTask.users

                let taskUserList = []
                for (let i in usersAssigned) {
                    taskUserList.push(state.getters.getDetailsUser(usersAssigned[i]))
                }

                const removeAssignedUser = userList.filter(u => {
                    return taskUserList.indexOf(u) === -1;
                })

                return removeAssignedUser
            },
        },

        filters: {
            name: ({first_name, last_name }) => {
                return `${first_name} ${last_name}`
            },
        }
    };
</script>

<style lang="scss">

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    .flip-list-move {
        transition: transform 0.5s;
    }

    .no-move {
        transition: transform 0s;
    }

    .ghost {
        opacity: 0;
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

    .card_content {
        background-color: rgb(235, 236, 239);
    }
</style>
