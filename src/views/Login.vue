<template>
    <div class="login d-flex justify-center align-center">
        <v-card elevation="5" max-width="500px" min-height="200px" min-width="250px">
            <v-card class="card_top shadow-lg d-flex justify-center bg-white rounded container" rounded="0"
                    elevation="3">
                <h3>Login</h3>
            </v-card>
            <div class="card_content pa-3 pt-5 pb-0">
                <v-text-field hint="Email" persistent-hint v-model="user_login" dense solo
                              height="20"></v-text-field>
                <v-text-field hint="Password" persistent-hint v-model="user_password" type="password" dense solo
                              height="20px"></v-text-field>
                <div style="color: red; min-height: 1.3em; line-height: 1.25">
                    <v-fade-transition>
                        <p v-if="error_message" class="pa-0 ma-0"
                           >
                            {{error_message}}
                        </p>
                    </v-fade-transition>
                </div>
            </div>
            <v-card elevation="24" class="card_bottom d-flex justify-center pa-3">
                <v-btn @click="login">Log in</v-btn>
            </v-card>
        </v-card>
    </div>
</template>

<script>
    import state from '@/store'

    export default {
        name: 'Login',
        data() {
            return {
                user_login: '',
                user_password: '',
                error_message: false,
            }
        },

        methods: {
            async login() {
                this.error_message = false

                let user = await state.dispatch('getUser', this.user_login)

                if (user.error) {
                    this.error_message = user.error
                    return false
                }

                this.$router.push('/home')

            }
        },
    }
</script>
<style lang="scss" scoped>
    .login {
        .v-btn{
            outline: none;
        }
        height: 100vh;

        .card_top {
            border-radius: 10px 10px 0px 0px !important;
        }

        .card_content {
            background-color: #EBECF0;
        }

        .card_bottom {
            border-radius: 0px 0px 10px 10px !important;
        }
    }


</style>
