<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">
                <img src="../assets/images/logo.svg" width="125"/>
            </a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/researcher">Researcher</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link active" to="/biobanker">Biobanker</router-link>
                    </li>
                </ul>
            </div>
            <span v-if="oidcIsAuthenticated" class="navbar-text me-2 ">
                Welcome back {{ oidcUser.name }}
            </span>
            <button
                v-if="!oidcIsAuthenticated"
                class="btn btn-outline-primary me-2"
                aria-current="page"
                @click.stop.prevent="authenticateOidc">
                Login
            </button>
            <button
                v-else
                class="btn btn-outline-secondary me-2"
                aria-current="page"
                @click.stop.prevent="signOutOidc">
                Logout
            </button>
        </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "navigation-bar",
  computed: {
    ...mapGetters(['oidcIsAuthenticated', 'oidcUser'])
  },
  methods: {
    ...mapActions([
        'signOutOidc',
        'authenticateOidc'
    ])
  }
};
</script>

<style>
nav {
  width: 100%;
  font-size: 1rem;
  text-align: left;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>

