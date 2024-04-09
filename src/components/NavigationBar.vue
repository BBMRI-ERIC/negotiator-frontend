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
              :class="$route.path === '/admin' || $route.params.userRole === 'ROLE_ADMIN' ? 'text-navbar-active-text' : 'text-navbar-text'"
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
              :class="$route.path === '/researcher' || $route.params.userRole === 'ROLE_RESEARCHER' ? 'text-navbar-active-text' : 'text-navbar-text'"
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
              :class="$route.path === '/biobanker' || $route.params.userRole === 'ROLE_REPRESENTATIVE' ? 'text-navbar-active-text' : 'text-navbar-text'"
              to="/biobanker"
            >
              <i class="bi bi-bank" />
              Your biobank
            </router-link>
          </li>
        </ul>
        <div
          v-if="oidcIsAuthenticated && returnCurrentMode"
          class="navbar-text me-2 text-navbar-welcome-text me-3"
          :class="returnCurrentModeTextColor"
        >
          <div
            class="spinner-grow spinner-grow-sm"
            role="status"
          />
          {{ returnCurrentMode }}
        </div>
        <span
          v-if="oidcIsAuthenticated"
          class="navbar-text me-2 text-navbar-welcome-text"
        >
          {{ oidcUser.preferred_username }}
        </span>
      </div>
      <div>
        <ProfileSettings
          :user="oidcUser"
          :is-representative="isRepresentative"
          class="me-3"
        />
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
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { ROLES } from "@/config/consts"
import ProfileSettings from "../components/ProfileSettings.vue"
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/nav-bar-bbmri.png"
import eucaimLogo from "../assets/images/eucaim/nav-bar-eucaim.png"
import canservLogo from "../assets/images/canserv/nav-bar-canserv.png"

export default {
  name: "NavigationBar",
  components: {
    ProfileSettings
  },
  data () {
    return {
      roles: [],
      logoSrc: activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles === "canserv" ? canservLogo : bbmriLogo)
    }
  },
  computed: {
    ...mapGetters(["oidcIsAuthenticated", "oidcUser"]),
    isAdmin () {
      return this.roles.includes(ROLES.ADMINISTRATOR)
    },
    isResearcher () {
      return this.roles.includes(ROLES.RESEARCHER)
    },
    isRepresentative () {
      return this.roles.includes(ROLES.REPRESENTATIVE)
    },
    returnCurrentMode () {
      if (import.meta.env.DEV) {
        return "Development Server"
      } else if (window.location.origin === "https://negotiator.acc.bbmri-eric.eu") {
        return "Acceptance Server"
      }
      return ""
    },
    returnCurrentModeTextColor () {
      if (import.meta.env.DEV) {
        return "text-success"
      } else if (window.location.origin === "https://negotiator.acc.bbmri-eric.eu") {
        return "text-warning"
      }
      return ""
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
