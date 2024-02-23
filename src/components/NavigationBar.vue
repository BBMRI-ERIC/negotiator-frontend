<template>
  <nav
    v-if="oidcIsAuthenticated"
    class="navbar fixed-top navbar-expand-lg navbar-light bg-navbar-background"
  >
    <div class="container-fluid">
      <img
        :src="logoSrc"
        height="34"
        class="me-2"
        alt="nav-bar-logo"
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
              :class="$route.path ===  '/admin'  || $route.params.userRole  === 'ROLE_ADMIN' ? 'text-navbar-active-text' : 'text-navbar-text'"
              to="/admin"
            >
              <i class="bi bi-clipboard-check" />
              Review requests
            </router-link>
          </li>
          <li 
            v-if="isResearcher"
            class="nav-item"
          >
            <router-link
              class="nav-link active nav-option"
              :class="$route.path ===  '/researcher' || $route.params.userRole  === 'ROLE_RESEARCHER' ? 'text-navbar-active-text' : 'text-navbar-text'"
              to="/researcher"
            >
              <i class="bi bi-chat-left-dots" />
              Your negotiations
            </router-link>
          </li>
          <li
            v-if="isRepresentative"
            class="nav-item"
          >
            <router-link
              class="nav-link active nav-option"
              :class="$route.path ===  '/biobanker' || $route.params.userRole  === 'ROLE_REPRESENTATIVE' ? 'text-navbar-active-text' : 'text-navbar-text'"
              to="/biobanker"
            >
              <i class="bi bi-bank" />
              Your biobank
            </router-link>
          </li>
        </ul>
        <span
          v-if="oidcIsAuthenticated"
          class="navbar-text me-2 text-navbar-welcome-text"
        >
          Welcome back {{ oidcUser.name }}
        </span>
        <button
          v-if="oidcIsAuthenticated"
          class="btn btn-outline-navbar-button-outline me-2"
          aria-current="page"
          @click.stop.prevent="signOutOidc"
          id="v-step-end"
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
import activeTheme from "../config/theme.js" 
import bbmriLogo from '../assets/images/nav-bar-bbmri.svg'
import eucaimLogo from '../assets/images/nav-bar-eucaim.png'

export default {
  name: "NavigationBar",
  data() {
    return {
      roles: [],
      logoSrc: activeTheme.activeLogosFiles === 'bbmri' ? bbmriLogo : eucaimLogo,
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

