<template>
  <h1 class="display-4 text-center">
    Welcome to the <b>BBMRI-ERIC Negotiator</b>
  </h1>
  <p class="display-6 text-center">
    Provides an efficient communication platform for biobankers and researchers requesting samples and/or data.
  </p>
  <div class="container mt-5">
    <div
      class="row"
      style="height: 500px;"
    >
      <div class="col-4" />
      <div class="col-4">
        <div
          class="card text-center bg-light"
        >
          <div class="card-body">
            <h1 class="display-6">
              Sign In:
            </h1>
            <figure>
              <a
                href="#"
                @click.stop.prevent="authenticateOidc"
              >
                <img
                  style="width: 100%;"
                  class="img-responsive"
                  src="../assets/images/ls-aai-login.svg"
                  @click.stop.prevent="authenticateOidc"
                >
              </a>
            </figure>
          </div>       
        </div>
        <div class="text-center mt-3 mb-2">
          New to LS-AAI? Visit their <a
            target="_blank"
            href="https://lifescience-ri.eu/ls-login.html"
          >website</a>.
        </div>
        <div class="text-center mb-5">
          Need help? <a href="mailto:negotiator@helpdesk.bbmri-eric.eu">Contact us</a>.
        </div>
        <img
          class="mt-5"
          src="../assets/images/bbmri-logo.png"
          width="150%"
        >
      </div>
      <div class="col-4" />
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
