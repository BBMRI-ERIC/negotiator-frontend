<template>
  <div
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <div class="row">
      <div class="col-1" />
      <div
        class="col-sm-10"
      >
        <div class="card shadow-lg pt-5 p-3">
          <h1
            class="text-center card-title text-secondary fw-bold mb-4"
          >
            <b>BBMRI-ERIC® NEGOTIATOR</b>
          </h1>
          <div class="card-body">
            <h2 class="card-subtitle text-center text-primary fw-bold pb-5">
              Choose how to log in
            </h2>
            <div
              class="d-grid mx-3"
            >
              <button
                class="btn btn-outline-light"
                @click.stop.prevent="authenticateOidc"
              >
                <img
                  width="34"
                  height="28"
                  class="float-start border-end border-2 pe-2"
                  src="../assets/images/ls-aai-logo.png"
                  alt="icon"
                >
                <span class="fw-bold align-self-center pe-4">
                  Life Science Login</span>
              </button>
            </div>
          </div>
          <img
            src="../assets/images/bbmri-logo.png"
            class="w-25 align-self-center mt-4 me-2"
            style="min-width: 50px;"
            alt="bbmri-logo"
          >
        </div>
        <div
          class="text-center mt-5 mb-2"
        >
          Not familiar with LS Login? Visit their <a
            target="_blank"
            href="https://lifescience-ri.eu/ls-login.html"
          >website</a>.
        </div>
        <div class="text-center mb-5">
          Need help? <a href="mailto:negotiator@helpdesk.bbmri-eric.eu">Contact us</a>.
        </div>
      </div>
      <div class="col-1" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  name: "HomePage",
  computed: {
    ...mapGetters(["oidcIsAuthenticated", "oidcUser"])
  },
  beforeMount() {
    if (this.oidcIsAuthenticated) {
      this.$router.push("/researcher")
    }
  },
  methods: {
    ...mapActions([
      "authenticateOidc"
    ])    
  }
}
</script>
<style scoped>
h1 {
  font-size: 3.5rem;
}
</style>