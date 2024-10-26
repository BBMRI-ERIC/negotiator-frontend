<template>
  <footer class="bottom-0 p-0 w-100 text-primary-text">
    <hr class="mt-10 mb-10">
    <div class="row d-flex flex-column flex-md-row">
      <div class="col text-center mb-4 mb-md-0">
        <a
          v-if="uiConfiguration?.isFooterLeftSideIconVisible"
          :href="uiConfiguration?.footerLeftSideIconLink"
        >
          <img
            width="150"
            :src="returnLogoSrc"
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
          v-if="uiConfiguration?.footerFollowUsLinkedin"
          :href="uiConfiguration?.footerFollowUsLinkedin"
          class="link-dark ms-2"
        >
          <i class="bi bi-linkedin mr-3" />
        </a>
        <a
          v-if="uiConfiguration?.footerFollowUsX"
          :href="uiConfiguration?.footerFollowUsX"
          class="link-dark ms-2"
        >
          <i class="bi bi-twitter-x" />
        </a>
        <a
          v-if="uiConfiguration?.footerFollowUsPodcast"
          :href="uiConfiguration?.footerFollowUsPodcast"
          class="link-dark ms-2"
        >
          <i class="bi bi-mic-fill" />
        </a>
      </div>
        <div class="mt-2 mb-2 mb-md-0" v-if="uiConfiguration?.isFooterGithubVisible">
          <a
            v-if="uiConfiguration?.footerGithubFrontendLink"
            href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"
            class="text-primary-text"
          > <i
            class="bi bi-github"
          />
            GitHub UI
          </a>
          <a
            v-if="uiConfiguration?.footerGithubBackendLink"
            href="https://github.com/BBMRI-ERIC/negotiator"
            class="text-primary-text ps-2"
          > <i class="bi bi-github" />
            GitHub Application
          </a>
        </div>

        <div
          class="mt-2 mb-2 mb-md-0"
        >
          <a
            v-if="uiConfiguration?.footerSwaggerLink && uiConfiguration?.isFooterSwaggerVisible"
            :href="uiConfiguration?.footerSwaggerLink"
            class="text-primary-text"
          > <i class="bi bi-braces-asterisk" />
            {{ uiConfiguration?.footerSwaggerText}}
          </a>
          <a
            v-if="uiConfiguration?.footerStatusPageLink && uiConfiguration?.isFooterStatusPageVisible"
            :href="uiConfiguration?.footerStatusPageLink"
            class="text-primary-text ps-2"
          > <i class="bi bi-check-circle" />
            {{ uiConfiguration?.footerStatusPageText }}
          </a>
        </div>
      </div>

      <div class="col text-center">
        <a
          v-if="uiConfiguration?.footerWorkProgrammeLink || uiConfiguration?.isFooterWorkProgrammeVisible || uiConfiguration?.footerWorkProgrammeText"
          class="link-dark text-primary-text"
          :href="uiConfiguration?.footerWorkProgrammeLink"
        >
          <img
            width="22"
            height="22"
            class="col"
            :src="returnWorkProgrammeSrc"
            alt="Work programme image"
          >
          {{ uiConfiguration?.footerWorkProgrammeText }}
        </a>
        <div
          v-if="uiConfiguration?.footerNewsletterLink || uiConfiguration?.isFooterNewsletterVisible || uiConfiguration?.footerNewsletterText"
          class="ms-md-3 mt-2"
        >
          <button
            type="button"
            class="btn btn-light ms-md-5 text-primary-text"
            :href="uiConfiguration?.footerNewsletterLink"
          >
          {{ uiConfiguration?.footerNewsletterText }}
          </button>
        </div>
        <div
          v-if="uiConfiguration?.isFooterPrivacyPolicyVisible"
          class="ms-md-2 mt-2"
        >
          <a
            class="link-dark text-primary-text me-5"
            :href="uiConfiguration?.footerPrivacyPolicyLink"
          >
          {{ uiConfiguration?.footerPrivacyPolicyText }}
          </a>
        </div>
      </div>
      <div>
        <div class="row mt-4">
          <div
            v-if="uiConfiguration?.isFooterCopyRightVisible"
            class="col text-center"
          >
            <p>{{ uiConfiguration?.footerCopyRightText }}</p>
          </div>
          <div v-else class="col text-center"></div>
          <div class="col text-center text-light ms-4">
            UI: <span class="pe-2">{{ gitTag }}</span>Application: <span>{{ backendVersion }}</span>
          </div>
          <div
            v-if="uiConfiguration?.isFooterHelpLinkVisible"
            class="col text-center ms-5"
          >
            Need help? <a :href="uiConfiguration?.footerHelpLink">Contact us</a>.
          </div>
          <div v-else class="col text-center ms-5"></div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue"
// import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/home-bbmri.png"
import canservLogo from "../assets/images/canserv/home-canserv.png"
import eucaimLogo from "../assets/images/eucaim/home-eucaim.png"
import workProgrammeLogo from "../assets/images/work-programme.png"
import { useActuatorInfoStore } from "../store/actuatorInfo.js"
import { useUiConfiguration } from '../store/uiConfiguration.js'

const uiConfigurationStore = useUiConfiguration()
const actuatorInfoStore = useActuatorInfoStore()
const viteGitTag = import.meta.env.VITE_GIT_TAG

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

const returnLogoSrc = computed(() => {
  if(uiConfiguration.value?.footerLeftSideIcon === 'bbmri'){
    return bbmriLogo
  } else if(uiConfiguration.value?.footerLeftSideIcon === 'canserv'){
    return canservLogo
  } else if(uiConfiguration.value?.footerLeftSideIcon === 'eucaim'){
    return eucaimLogo
  }
  return uiConfiguration.value?.footerLeftSideIcon
})

const returnWorkProgrammeSrc = computed(() => {
  if(uiConfiguration.value?.footerWorkProgrammeImageUrl === 'workProgramme'){
    return workProgrammeLogo
  }
  return uiConfiguration.value?.footerWorkProgrammeImageUrl
})
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>