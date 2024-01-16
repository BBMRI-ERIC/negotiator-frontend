<template>
  <div
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <div class="row">
      <div class="col-1" />
      <div
        class="col-sm-10"
      >
        <div class="card py-5 p-3">
          <div class="col-10 col-md-4 align-self-center">
            <img
              src="../assets/images/bbmri-logo.png"
              class="img-fluid mt-4 mb-2"
              style="min-width: 50px;"
              alt="bbmri-logo"
            >
          </div>
          <h1
            class="text-center card-title text-logo-grey fw-bold mb-5"
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
                <span class="align-self-center fw-boldtext-logo-grey pe-4">
                  Life Science Login</span>
              </button>
            </div>
          </div>
        </div>
        <div
          class="text-center mt-2 mb-2"
        >
          Not familiar with LS Login? Visit their <a
            target="_blank"
            href="https://lifescience-ri.eu/ls-login.html"
          >website</a>.
        </div>
        <div class="text-center mb-2">
          Need help? <a href="mailto:negotiator@helpdesk.bbmri-eric.eu">Contact us</a>.
        </div>
        <div class="text-center col mb-2">
            <i class="bi bi-github" />
            <a href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"> GitHub</a>
        </div>
        <div class="text-center mb-5">
          <p>&copy; 2024 BBMRI-ERIC</p>
        </div>
      </div>
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