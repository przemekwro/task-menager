<template>
    <div>

        <div>
            <p class="ml-2 row align-center">First name: {{user.first_name}}</p>
            <p class="ml-2 row align-center">Last name: {{user.last_name}}</p>
            <p class="ml-2 row align-center">Email:
                <v-icon>mdi-email</v-icon>
                {{user.email}}
            </p>
            <p class="ml-2 row align-center">Gender:
                <v-icon v-if="user.gender === 'Male'">mdi-human-male</v-icon>
                <v-icon v-else>mdi-human-female</v-icon>
                {{user.first_name}}
            </p>
            <p class="ml-2 row align-center">Job title: {{user.job_title}}</p>
            <p class="ml-2 row align-center">Postal Code: <span class="ml-1" v-if="!user.postal_code">	 &#x20; Unknown </span>
                <span class="ml-1" v-else>{{user.postal_code}}</span></p>
            <p class="ml-2 row align-center">Street:
                <v-icon>mdi-map-marker</v-icon>
                {{user.street}}
            </p>
            <p class="ml-2 row align-center">City:
                <v-icon>mdi-city</v-icon>
                {{user.city}}
            </p>
            <p class="ml-2 row align-center">Localization:
                <v-icon>mdi-map-marker</v-icon>
                {{user.lat}} {{user.lng}}
            </p>
            <p class="ml-2 row align-center">Description: {{user.description}}</p>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'UserListTask',

        props: ['user'],
    }
</script>

<style lang="scss">
    p {
        font-size: 20px;
    }
</style>
