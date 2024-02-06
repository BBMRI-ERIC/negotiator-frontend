<template>
  <nav
    v-if="oidcIsAuthenticated"
    class="navbar fixed-top navbar-expand-lg navbar-light bg-light"
  >
    <div class="container-fluid">
      <img
        src="../assets/images/logo.svg"
        height="34"
        class="me-2"
      >
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
        <ul 
          class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"  
        >
          <li 
            v-if="isAdmin"
            class="nav-item"
          >
            <router-link
              class="nav-link active nav-option"
              to="/admin"
            >
              <i class="bi bi-house-gear" />
              Review requests
            </router-link>
          </li>
          <li 
            v-if="isResearcher"
            class="nav-item"
          >
            <router-link
              class="nav-link active nav-option"
              to="/researcher"
            >
              <i class="bi bi-folder2" />
              Your negotiations
            </router-link>
          </li>
          <li
            v-if="isRepresentative"
            class="nav-item"
          >
            <router-link
              class="nav-link active nav-option"
              to="/biobanker"
            >
              <i class="bi bi-hospital" />
              Your biobank
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
          v-if="oidcIsAuthenticated"
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
import { mapActions, mapGetters } from "vuex"
import { ROLES } from "@/config/consts"

export default {
  name: "NavigationBar",
  data() {
    return {
      roles: []
    }
  },
  computed: {
    ...mapGetters(["oidcIsAuthenticated", "oidcUser"]),
    isAdmin() {
      return this.roles.includes(ROLES.ADMINISTRATOR)
    },
    isResearcher() {
      return this.roles.includes(ROLES.RESEARCHER)
    },
    isRepresentative() {
      return this.roles.includes(ROLES.REPRESENTATIVE)
    }
  },
  watch: {
    async oidcIsAuthenticated () {
      this.roles = await this.retrieveUserRoles()
    }
  },
  methods: {
    ...mapActions([
      "signOutOidc",
      "authenticateOidc",
      "retrieveUserRoles"
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
.nav-item:hover .nav-option:hover {
    color: var(--bs-primary) ;
}
</style>

