import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        users: null,
        loaded: false,
        category: [
            {
                name: 'Realizowane',
                id: 0,
                tasks: [
                    {
                        id: 0,
                        name: 'Zrobic porzadek',
                        users: [5, 1, 2, 20],
                        star: true,
                        date: 1598606942744,
                    },
                    {
                        id: 1,
                        name: 'Poprawa listingu',
                        users: [1, 2, 4, 6],
                        star: true,
                        date: 1598606923114,
                    },
                    {
                        id: 2,
                        name: "Pole wyszukiwania",
                        users: [2, 3, 5],
                        star: false,
                        date: 1598606951214,
                    },
                ]
            },
            {
                name: 'Wstrzymane',
                id: 1,
                tasks: [
                    {
                        id: 3,
                        name: 'Rabat',
                        users: [2],
                        star: false,
                        date: 1598606953999,
                    },
                    {
                        id: 4,
                        name: 'Wyłączenie adresów',
                        users: [8, 9, 10, 20],
                        star: false,
                        date: 1598607005311,
                    },
                ]
            },
            {
                name: 'Do realizacji',
                id: 2,
                tasks: [
                    {
                        id: 5,
                        name: 'Płatność odroczona',
                        users: [2, 6],
                        star: false,
                        date: 1598607016049,
                    },
                ]
            },
            {
                name: 'Rozwiązane',
                id: 3,
                tasks: [
                    {
                        id: 6,
                        name: 'Dane kontaktowe dla powiadomień',
                        users: [2, 12, 23, 21, 20],
                        star: false,
                        date: 1598607035210,
                    },
                    {
                        id: 7,
                        name: 'Zrobić porządek',
                        users: [2, 12, 23, 21],
                        star: true,
                        date: 1598607032210,
                    },
                    {
                        id: 8,
                        name: 'Inne',
                        users: [2, 12, 23,  21],
                        star: false,
                        date: 1598607035320,
                    },
                ]
            },
            {
                name: 'Zakończone',
                id: 4,
                tasks: [
                    {
                        id: 9,
                        name: 'Wykresy - rozbudowa',
                        users: [2, 21],
                        star: false,
                        date: 1598607059554,
                    },
                    {
                        id: 10,
                        name: 'Audyt',
                        users: [12, 25],
                        star: true,
                        date: 1598607070418,
                    },
                    {
                        id: 11,
                        name: 'Inne',
                        users: [7, 15, 27],
                        star: false,
                        date: 1598607070418,
                    },
                ]
            },
        ],
        logged_user: null || JSON.parse(localStorage.getItem('logged_user'))
    },

    mutations: {
        setUsers(state, users) {
            state.users = users
        },

        isDownloaded(state) {
            state.loaded = true
        },

        login(state, user) {
            state.logged_user = user
            localStorage.setItem('logged_user', JSON.stringify(user))
        },

        logout(state) {
            state.logged_user = null
            localStorage.removeItem('logged_user')
        },

        saveTask(state, data) {
            for (let i in state.category) {
                if (data.category.name === state.category[i].name) {

                    state.category[i].tasks.push(data.task)
                }
            }
        },

        addUserToTask(state, data) {
            for (let i in state.category) {
                for (let j in state.category[i].tasks) {
                    if (state.category[i].tasks[j] === data.task) {
                        state.category[i].tasks[j].users.push(data.user)
                        return true
                    }
                }
            }
        },
    },

    actions: {
        async downloadUsers(state) {
            if (!state.getters.getLoaded) {
                await axios.get('https://www.mocky.io/v2/5e0de1893300002b00aa88f3').then(data => {
                    state.commit('setUsers', data.data)
                    state.commit('isDownloaded')
                })
            }
        },

        async getUser(state, login) {
            if (!state.getters.getLoaded) {
                await state.dispatch('downloadUsers')
            }

            const users = state.getters.getUsers
            const lower_login = login.toLowerCase()
            const user = users.find(u => u.email === lower_login)

            if (!users) {
                return {error: 'Problem with data.'}
            }

            if (!user) {
                return {error: 'Wrong username or password!'}
            }

            state.commit('login', user)
            return user
        },

        getLastId(state) {
            const category = state.getters.getCategory
            let id = -1
            for (let i in category) {
                for (let j in category[i].tasks) {
                    if (category[i].tasks[j] && category[i].tasks[j].id > id) {
                        id = category[i].tasks[j].id
                    }
                }
            }
            return id + 1
        },

        addTask(state, data) {
            let id = 0
            const category = state.getters.getCategory

            for (let i in category) {
                for (let j in category[i].tasks) {
                    if (category[i].tasks[j] && category[i].tasks[j].id > id) {
                        id = category[i].tasks[j].id
                    }
                }
            }

            let task = data.task
            task.id = id + 1

            state.commit('saveTask', {category: data.category, task: task})

        },

        getUserToTask(state, id) {
            if (!id) return false
            let users = []
            for (const i in id) {
                users.push(state.getters.getDetailsUser(parseInt(id[i])))
            }
            return users
        },
    },

    getters: {
        getLoaded(state) {
            return state.loaded
        },

        getUsers(state) {
            return state.users
        },

        isLogged(state) {
            if (!state.logged_user) return false
            return true
        },

        getLoggedUser(state) {
            return state.logged_user
        },

        getCategory(state) {
            return state.category
        },

        getDetailsUser: state => id => {
            const parseId = parseInt(id)
            return state.users.find(user => user.id === parseId)
        },

        getLastId(state) {
            let id = 0
            for (let i in state.category) {
                for (let j in state.category[i].tasks) {
                    if (state.category[i].tasks[j].id > id)
                        id = j.id
                }
            }
            return id + 1
        },

        getUsersWithJob(state) {
            return state.users.filter(u => u.job_title)
        },

        getTaskToUser: state => id => {
            const category = state.category
            let tasks = []

            const parseId = parseInt(id)

            for (let i in category) {
                for (let j in category[i].tasks) {
                    if (category[i].tasks[j].users.includes(parseId))
                        tasks.push(category[i].tasks[j])
                }
            }

            return tasks
        },
    },

    modules: {}
})
