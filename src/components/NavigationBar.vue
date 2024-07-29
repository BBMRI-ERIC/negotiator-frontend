<template>
  <nav
    v-if="oidcIsAuthenticated"
    id="v-step-0"
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
          <li
            v-if="featureFlagsFAQ"
            class="nav-item"
          >
            <router-link
              class="nav-link active nav-option"
              :class="$route.path === '/FAQ' ? 'text-navbar-active-text' : 'text-navbar-text'"
              to="/FAQ"
            >
              <i class="bi bi-people" />
              Support
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
        <Notifications
          v-if="featureFlagsNotifications"
          class="me-3"
        />
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
          :is-admin="isAdmin"
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

<script setup>
import { ref, computed, watch, onBeforeMount } from "vue"
import { ROLES } from "@/config/consts"
import ProfileSettings from "../components/ProfileSettings.vue"
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/nav-bar-bbmri.png"
import eucaimLogo from "../assets/images/eucaim/nav-bar-eucaim.png"
import canservLogo from "../assets/images/canserv/nav-bar-canserv.png"
import Notifications from "../components/Notifications.vue"
import allFeatureFlags from "@/config/featureFlags.js"
import { useStore } from "vuex"

const store = useStore()

const roles = ref([])
const logoSrc = activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles === "canserv" ? canservLogo : bbmriLogo)
const featureFlagsFAQ = !!(allFeatureFlags.faqPage === "true" || allFeatureFlags.faqPage === true)
const featureFlagsNotifications = !!(allFeatureFlags.notifications === "true" || allFeatureFlags.notifications === true)
const backendEnvironment = ref("")

const oidcIsAuthenticated = computed(() => {
  return store.getters.oidcIsAuthenticated
})
const oidcUser = computed(() => {
  return store.getters.oidcUser
})
const isAdmin = computed(() => {
  return roles.value.includes(ROLES.ADMINISTRATOR)
})
const isResearcher = computed(() => {
  return roles.value.includes(ROLES.RESEARCHER)
})
const isRepresentative = computed(() => {
  return roles.value.includes(ROLES.REPRESENTATIVE)
})
const returnCurrentMode = computed(() => {
  if (import.meta.env.DEV) {
    return "Development Server"
  } else if (backendEnvironment.value === "Acceptance") {
    return "Acceptance Server"
  }
  return ""
})
const returnCurrentModeTextColor = computed(() => {
  if (import.meta.env.DEV) {
    return "text-success"
  } else if (backendEnvironment.value === "Acceptance") {
    return "text-warning"
  }
  return ""
})
const userInfo = computed(() => {
  return store.getters.getUserInfo
})

watch(userInfo, () => {
  retrieveUserRoles()
})

onBeforeMount(() => {
  retrieveBackendEnvironment()
})

async function retrieveBackendEnvironment () {
  await store.dispatch("retrieveBackendEnvironment").then((res) => {
    backendEnvironment.value = res
  })
}
function retrieveUserRoles () {
  roles.value = userInfo.value.roles
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
