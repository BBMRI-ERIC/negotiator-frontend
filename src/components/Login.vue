<template>
    <div class="container pt-4">
        <div class="row">
            <div class="col-3"></div>
            <div class="col-6">
                <div class="jumbotron">
                    <h1 class="display-4">Please login before continuing</h1>
                    <p class="lead">You cannot access this page before logging in</p>
                    <button
                        class="btn btn-outline-primary me-2"
                        aria-current="page"
                        @click.stop.prevent="onLogin"
                    >Login</button>
                </div>
            </div>
            <div class="col-3"></div>
        </div>        
    </div>
    
</template>

<script>
export default {
    methods: {
        onLogin() {
            this.$auth.login(this.$router.currentRoute.value.fullPath);
        },
    },
    mounted() {
        console.log(this.$auth.isUserLoggedIn())
    }
}
</script>

