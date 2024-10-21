<template>
  <footer class="bottom-0 p-0 w-100 text-primary-text">
    <hr class="mt-10 mb-10">
    <div class="row d-flex flex-column flex-md-row">
      <div class="col text-center mb-4 mb-md-0">
        <a
          v-if="activeTheme.isFooterLeftSideIconVisible"
          :href="activeTheme.footerLeftSideIconLink"
        >
          <img
            width="150"
            :src="logoSrc"
            alt="logo footer"
          >
        </a>
      </div>
      <div class="col text-center">
        <div v-if="uiConfiguration?.isFooterFollowUsVisible">
        <span>
          Follow Us:
        </span>
        <a
          v-if="uiConfiguration?.isFooterFollowUsVisible"
          :href="uiConfiguration?.footerFollowUsLinkedin"
          class="link-dark ms-2"
        >
          <i class="bi bi-linkedin mr-3" />
        </a>
        <a
          v-if="uiConfiguration?.isFooterFollowUsVisible"
          :href="uiConfiguration?.footerFollowUsX"
          class="link-dark ms-2"
        >
          <i class="bi bi-twitter-x" />
        </a>
        <a
          v-if="uiConfiguration?.isFooterFollowUsVisible"
          :href="uiConfiguration?.footerFollowUsX"
          class="link-dark ms-2"
        >
          <i class="bi bi-mic-fill" />
        </a>
      </div>
        <div class="mt-2 mb-2 mb-md-0">
          <a
            href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"
            class="text-primary-text"
          > <i
            class="bi bi-github"
          />
            GitHub UI
          </a>
          <a
            href="https://github.com/BBMRI-ERIC/negotiator"
            class="text-primary-text ps-2"
          > <i class="bi bi-github" />
            GitHub Application
          </a>
        </div>

        <div
          v-if="activeTheme.isFooterFollowUsVisible"
          class="mt-2 mb-2 mb-md-0"
        >
          <a
            href="/api/swagger-ui/index.html"
            class="text-primary-text"
          > <i class="bi bi-braces-asterisk" />
            API
          </a>
          <a
            v-if="activeTheme.isFooterStatusPageVisible"
            :href="activeTheme.footerStatusPageLink"
            class="text-primary-text ps-2"
          > <i class="bi bi-check-circle" />
            {{ activeTheme.footerStatusPageText }}
          </a>
        </div>
      </div>

      <div class="col text-center">
        <a
          v-if="activeTheme.isFooterWorkProgrammeVisible"
          class="link-dark text-primary-text"
          :href="activeTheme.footerWorkProgrammeLink"
        >
          <img
            width="22"
            height="22"
            class="col"
            src="@/assets/images/work-programme.png"
            alt="Work programme image"
          >
          Work Programme
        </a>
        <div
          v-if="activeTheme.isFooterNewsletterVisible"
          class="ms-md-3 mt-2"
        >
          <button
            type="button"
            class="btn btn-light ms-md-5 text-primary-text"
            :href="activeTheme.footerNewsletter"
          >
            Subscribe To Our Newsletter
          </button>
        </div>
        <div
          v-if="activeTheme.isFooterPrivacyPolicyVisible"
          class="ms-md-2 mt-2"
        >
          <a
            class="link-dark text-primary-text me-5"
            :href="activeTheme.footerPrivacyPolicy"
          >
            Privacy Policy
          </a>
        </div>
      </div>
      <div>
        <div class="row mt-4">
          <div
            v-if="activeTheme.isFooterCopyRightVisible"
            class="col  text-center"
          >
            <p>{{ activeTheme.footerCopyRight }}</p>
          </div>
          <div class="col text-center text-light ms-4">
            UI: <span class="pe-2">{{ gitTag }}</span>Application: <span>{{ backendVersion }}</span>
          </div>
          <div
            v-if="activeTheme.isFooterHelpLinkVisible"
            class="col text-center ms-5"
          >
            Need help? <a :href="activeTheme.footerHelpLink">Contact us</a>.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue"
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/home-bbmri.png"
import eucaimLogo from "../assets/images/eucaim/home-eucaim.png"
import canservLogo from "../assets/images/canserv/home-canserv.png"
import { useActuatorInfoStore } from "../store/actuatorInfo.js"
import { useUiConfiguration } from '../store/uiConfiguration.js'

const uiConfigurationStore = useUiConfiguration()
const actuatorInfoStore = useActuatorInfoStore()
const viteGitTag = import.meta.env.VITE_GIT_TAG

const logoSrc = activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles === "canserv" ? canservLogo : bbmriLogo)
const isFooterFollowUsVisible = !!(activeTheme.isFooterFollowUsVisible === "true" || activeTheme.isFooterFollowUsVisible === true)
const gitTag = viteGitTag
const backendVersion = ref("")

onBeforeMount(() => {
  actuatorInfoStore.retrieveBackendActuatorInfo().then(() => {
    backendVersion.value = actuatorInfoStore.actuatorInfoBuildVersion
  });
})

const uiConfiguration = computed(() => {
  return uiConfigurationStore.uiConfiguration?.footer
})

function getWorkProgrammeIcon () {
  return new URL(`${activeTheme.footerWorkProgrammeIcon}`)
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>