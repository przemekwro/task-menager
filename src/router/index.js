import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from "@/views/Home";
import state from '@/store'
import UserDetails from "@/views/UserDetails";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/user/:id',
        name: 'UserDetails',
        component: UserDetails,
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to,from, next) => {
        if (to.name !== "Login" && !state.getters.isLogged) next({name: 'Login'})
        else if (to.name === 'Login' && state.getters.isLogged) next({name: 'Home'})
        else if (!routes.find(r => r.name === to.name)) next({name: 'Home'})
        else next()
    }
)


export default router
