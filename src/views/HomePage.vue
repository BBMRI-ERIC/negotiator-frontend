<template>
  <header>
    <navigation-bar/>
  </header>
  <div>
    <h1 v-if="!isUserLoggedIn">
      Welcome! ckick in the login button below to start login process
    </h1>
    <h1 v-if="isUserLoggedIn">
      Dear {{ user }}, You are logged in! This is your Authentication Token:
    </h1>
    <div class="box">
      <p align="justify">{{ authToken }}</p>
    </div>
    <h5>This is the negotiator</h5>
  </div>
</template>

<script>
import NavigationBar from '../components/NavigationBar.vue';
export default {
  name: "home-page",
  components: {
    NavigationBar
  },
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
  },
};
</script>

<style scoped>
.box {
  inline-size: 300px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>