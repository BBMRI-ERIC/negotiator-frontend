<template>
  <div
    v-if="!oidcIsAuthenticated"
    class="container-fluid d-flex justify-content-center align-items-center vh-100  mt-5"
  >
    <div class="row">
      <div class="col-1" />
      <div
        class="col-sm-10"
      >
        <div class="card py-5 p-3">
          <div class="col-10 col-md-4 align-self-center">
            <img
              :src="logoSrc"
              class="img-fluid mt-4 mb-2"
              style="min-width: 50px;"
              alt="home-page-logo"
            >
          </div>
          <h1
            class="text-center card-title text-login-tittle-text fw-bold mb-5"
          >
            <b>NEGOTIATOR</b>
          </h1>
          <div class="card-body">
            <h4 class="card-subtitle text-center text-primary fw-bold pb-2">
              Choose how to log in
            </h4>
            <div
              class="d-grid mx-3 mb-5"
            >
              <button
                class="btn btn-outline-light"
                @click.stop.prevent="authenticateOidc"
              >
                <img
                  width="28"
                  height="23"
                  class="float-center mb-1 pe-2"
                  src="../assets/images/ls-aai-logo.png"
                  alt="icon"
                >
                <span class="align-self-center  text-primary pe-4">
                  Life Science Login</span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="text-center text-primary-text mt-2 mb-2"
        >
          Not familiar with LS Login? Visit their <a
            class="text-primary"
            target="_blank"
            href="https://lifescience-ri.eu/ls-login.html"
          >Website</a>.
        </div>
        <div class="text-center text-primary-text col mb-2">
          <i class="bi bi-github me-1" />
          <a href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend">GitHub UI</a>
          <span class="ms-2">
            <i class="bi bi-github me-1" />
            <a href="https://github.com/BBMRI-ERIC/negotiator">GitHub Application</a>
          </span>
        </div>
        <div
          class="text-center text-primary-text mt-2 mb-2"
        >
          <a
            href="/api/swagger-ui/index.html"
          > <i class="bi bi-braces-asterisk text-primary-text" />
            API
          </a>
          <a
            href="https://status.bbmri-eric.eu/"
            class="ps-2"
          >  <i class="bi bi-check-circle text-primary-text" />
            BBMRI-ERIC Status page
          </a>
        </div>
        <div class="text-center text-primary-text mb-2">
          Need help? <a
            class="text-primary"
            href="mailto:negotiator@helpdesk.bbmri-eric.eu"
          >Contact us</a>.
        </div>
        <div class="text-center text-primary-text col mb-2">
          <i class="bi bi-github" />
          <a
            class="text-primary"
            href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"
          > GitHub</a>
        </div>
        <div class="text-center text-light">
          UI version: <span class="pe-2">{{ gitTag }}</span>Server version: <span>{{ backendVersion }}</span>
        </div>
        <div class="text-center text-primary-text mb-5">
          <p>&copy; 2024 BBMRI-ERIC</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue"
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/home-bbmri.png"
import eucaimLogo from "../assets/images/eucaim/home-eucaim.png"
import canservLogo from "../assets/images/canserv/home-canserv.png"
import { useRouter } from "vue-router"
import { useActuatorInfoStore } from "../store/actuatorInfo.js"
import { useOidcStore } from "../store/oidc.js"

const viteGitTag = import.meta.env.VITE_GIT_TAG

const actuatorInfoStore = useActuatorInfoStore()

const router = useRouter()

const logoSrc = activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles === "canserv" ? canservLogo : bbmriLogo)
const gitTag = ref(viteGitTag)
const backendVersion = ref("")
const oidcStore = useOidcStore()

const oidcIsAuthenticated = computed(() => {
  return oidcStore.oidcIsAuthenticated
})

onBeforeMount(() => {
  if (oidcIsAuthenticated.value) {
    router.push("/researcher")
  }
  actuatorInfoStore.retrieveBackendActuatorInfo().then(() => {
    backendVersion.value = actuatorInfoStore.actuatorInfoBuildVersion
  })
})

 function authenticateOidc () {
   oidcStore.authenticateOidc()
}
</script>

<style scoped>
h1 {
  font-size: 3.5rem;
}
</style>
