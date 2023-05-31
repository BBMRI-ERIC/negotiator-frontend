<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a
        class="navbar-brand"
        href="/"
      >
        <img
          src="../assets/images/logo.svg"
          width="125"
        >
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#menu-navbar"
        aria-controls="menu-navbar"
        aria-expanded="false"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="menu-navbar"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll">
          <li class="nav-item">
            <router-link
              class="nav-link active"
              to="/researcher"
            >
              Researcher
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link active"
              to="/biobanker"
            >
              Biobanker
            </router-link>
          </li>
        </ul>
        <span
          v-if="oidcIsAuthenticated"
          class="navbar-text me-2 "
        >
          Welcome back {{ oidcUser.name }}
        </span>
        <button
          v-if="!oidcIsAuthenticated"
          class="btn btn-outline-primary me-2"
          aria-current="page"
          @click.stop.prevent="authenticateOidc"
        >
          Login
        </button>
        <button
          v-else
          class="btn btn-outline-secondary me-2"
          aria-current="page"
          @click.stop.prevent="signOutOidc"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "NavigationBar",
  computed: {
    ...mapGetters(["oidcIsAuthenticated", "oidcUser"])
  },
  methods: {
    ...mapActions([
      "signOutOidc",
      "authenticateOidc"
    ])
  }
}
</script>

<style>
nav {
    width: 100%;
    font-size: 1rem;
    text-align: left;
}
</style>

