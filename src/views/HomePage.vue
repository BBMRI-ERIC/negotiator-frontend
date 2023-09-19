<template>
  <div
    class="container"
  >
    <div
      class="col-10"
    >
      <div class="card">
        <h1
          class="text-center card-title"
          style="padding-top: 30px; padding-bottom: 20px; align-self: center"
        >
          <b>BBMRI-ERIC® NEGOTIATOR</b>
        </h1>
        <div class="card-body">
          <h2 class="card-subtitle text-center ">
            Choose how to log in
          </h2>
          <div
            class="row col-lg-12"
            style="display: table; padding-left: 10px;  padding-bottom: 20px; padding-top: 5px"
          >
            <div>
              <div class="list-group">
                <a
                  class="btn btn-block list-group-item"
                  href="#"
                  @click.stop.prevent="authenticateOidc"
                >
                  <img
                    class="login-icon"
                    src="../assets/images/ls-aai-logo.png"
                    alt="icon"
                  >
                  <strong>Life Science Login</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
        <img
          src="../assets/images/bbmri-logo.png"
          alt="bbmri-logo"
          style="max-height: 50px; max-width: 50%; align-self: center;"
        >
      </div>
      <div
        class="text-center mt-3 mb-2"
        style="margin-top: 40px; padding-top: 20px"
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
.container {
  display: flex; /* Use flexbox */
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
  padding-top: 50px;
  height: 100%;
}
.card {
  padding-top: 10px;
  padding-bottom: 30px;
  height: 100%;
  border-radius: 10px; /* Add rounded corners to the card */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Add a shadow */
}
h1 {
  font-family: Calibri, Arial, sans-serif;
  color: rgb(0,66,128);
  font-weight: bolder;
  font-size: 60px;
}
h2 {
  font-family: Calibri, Arial, sans-serif;
  color: rgb(233,87,19);
  font-weight: bold;
  padding-bottom: 40px;
}
.list-group  {
  text-align: left;
  border: 1px;
}
.list-group:hover {
  border: lightgray;
  background: lightgray;
}
.login-icon {
  max-height: 40px;
  max-width: 40px;
  padding: 6px;
  border-right: 2px solid rgba(0, 0, 0, 0.2);
  position: absolute;
  top:1px;
  bottom: 1px;
  left: 5px;
  right: 5px;
}
.btn-block {
  width: 100%;
}
</style>