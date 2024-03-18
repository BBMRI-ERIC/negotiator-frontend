<template>
  <footer
    class="bottom-0 p-0 w-100 text-primary-text"
  >
    <hr class="mt-10 mb-10">
    <div class="row d-flex flex-column flex-md-row">
      <div class="col text-center mb-4 mb-md-0">
        <a href="https://bbmri-eric.eu">
          <img
            width="150"
            :src="logoSrc"
            alt="logo negotiator"
          >
        </a>
      </div>
      <div class="col text-center">
        <span>
          Follow Us:
        </span>
        <a
          v-if="isFooterFollowUsVisible"
          href="https://www.linkedin.com/company/bbmri-eric"
          class="link-dark ms-2"
        >
          <i class="bi bi-linkedin mr-3" />
        </a>
        <a
          v-if="isFooterFollowUsVisible"
          href="https://twitter.com/BBMRIERIC"
          class="link-dark ms-2"
        >
          <i class="bi bi-twitter-x" />
        </a>
        <a
          v-if="isFooterFollowUsVisible"
          href="https://www.bbmri-eric.eu/bbmri-eric/bbmri-eric-podcast/"
          class="link-dark ms-2"
        >
          <i class="bi bi-mic-fill" />
        </a>
        <div class="mt-2 mb-2 mb-md-0">
          <a
            href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"
            class="text-primary-text"
          >  <i class="bi bi-github" />
            GitHub UI
          </a>
          <a
            href="https://github.com/BBMRI-ERIC/negotiator"
            class="text-primary-text ps-2"
          >  <i class="bi bi-github" />
            GitHub Application
          </a>
        </div>

        <div
          v-if="isFooterFollowUsVisible"
          class="mt-2 mb-2 mb-md-0"
        >
          <a
            href="/api/swagger-ui/index.html"
            class="text-primary-text"
          > <i class="bi bi-braces-asterisk" />
            Swagger Negotiator API
          </a>
          <a
            href="https://status.bbmri-eric.eu/"
            class="text-primary-text ps-2"
          >  <i class="bi bi-check-circle" />
            BBMRI-ERIC Status page
          </a>
        </div>
      </div>

      <div class="col text-center">
        <a
          class="link-dark text-primary-text"
          href="https://www.bbmri-eric.eu/wp-content/uploads/BBMRI-ERIC_work-program_2022-2024_DIGITAL.pdf"
        >
          <img
            width="22"
            height="22"
            class="col"
            src="../assets/images/work-programme.png"
            alt="Work programme image"
          >
          Work Programme
        </a>
        <div
          v-if="isFooterFollowUsVisible"
          class="ms-md-3 mt-2"
        >
          <button
            type="button"
            class="btn btn-light ms-md-5 text-primary-text"
            href="https://www.bbmri-eric.eu/news-event/"
          >
            Subscribe To Our Newsletter
          </button>
        </div>
        <div
          v-if="isFooterFollowUsVisible"
          class="ms-md-2 mt-2"
        >
          <a
            class="link-dark text-primary-text me-5"
            href="https://www.bbmri-eric.eu/wp-content/uploads/AoM_10_8_Access-Policy_FINAL_EU.pdf"
          >
            Privacy Policy
          </a>
        </div>
      </div>
      <div>
        <div class="row mt-4">
          <div class="col  text-center">
            <p>&copy; 2024 BBMRI-ERIC</p>
          </div>
          <div class="col d-none d-lg-block" />
          <div class="col text-center ms-5">
            Need help? <a class="text-primary" href="mailto:negotiator@helpdesk.bbmri-eric.eu">Contact us</a>.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/footer-bbmri.svg"
import eucaimLogo from "../assets/images/eucaim/footer-eucaim.png"
import canservLogo from "../assets/images/canserv/footer-canserv.png"

export default {
  name: "FooterPage",
  data () {
    return {
      logoSrc: activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles=== 'canserv' ? canservLogo : bbmriLogo),
      isFooterFollowUsVisible: activeTheme.isFooterFollowUsVisible
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>
