<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Negotiator Home</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a
              v-if="!isUserLoggedIn"
              class="nav-link active"
              aria-current="page"
              href="#"
              @click.stop.prevent="onLogin"
              >Login
            </a>
            <a
              v-else
              class="nav-link active"
              aria-current="page"
              href="#"
              @click.stop.prevent="onLogout"
              >Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navigation-bar",
  data() {
    return {
      isUserLoggedIn: false,
      authToken: "",
      user: "",
    };
  },
  async mounted() {
    this.isUserLoggedIn = await this.$auth.isUserLoggedIn();
    if (this.isUserLoggedIn) {
      this.authToken = await this.$auth.getAccessToken();
      const profile = await this.$auth.getProfile();
      this.user = profile.name;
    }
    //this.$auth.isUserLoggedIn()
    //  .then(isLoggedIn => {
    //    console.log('Evaluating Mounted...')
    //    console.log(isLoggedIn)
    //    this.isUserLoggedIn = isLoggedIn
    //  })
    // If somehting goes wrong we assume no user is logged in
    //  .catch(error => {
    //    console.log(error)
    //    this.isUserLoggedIn = false
    // })
  },
  methods: {
    onLogin() {
      this.$auth.login();
    },
    onLogout() {
      this.$auth.logout();
    },
  },
};
</script>

<style>
nav {
  width: 100%;
  font-size: 1rem;
  text-align: left;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>

