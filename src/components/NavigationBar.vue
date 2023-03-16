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
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <span v-if="isUserLoggedIn" class="navbar-text me-2 "
            >Welcome back {{ user }}</span
          >
          <li class="nav-item">
            <button
              v-if="!isUserLoggedIn"
              class="btn btn-outline-primary me-2"
              aria-current="page"
              @click.stop.prevent="onLogin"
            >
              Login
            </button>
            <button
              v-else
              class="btn btn-outline-secondary me-2"
              aria-current="page"
              @click.stop.prevent="onLogout"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navigation-bar",
  props: {
    user: String,
  },
  data() {
    return {
      isUserLoggedIn: false,
    };
  },
  async mounted() {
    this.isUserLoggedIn = await this.$auth.isUserLoggedIn();
  },
  methods: {
    onLogin() {
      console.log(this.$router.currentRoute.value.fullPath)
      this.$auth.login(this.$router.currentRoute.value.fullPath);
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

