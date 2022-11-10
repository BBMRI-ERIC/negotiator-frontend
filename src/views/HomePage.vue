<template>
  <header>
    <navigation-bar :user="user" />
  </header>
  <negotiation-form></negotiation-form>
</template>

<script>
import NegotiationForm from "@/components/NegotiationForm.vue";
import NavigationBar from "@/components/NavigationBar.vue";

export default {
  name: "home-page",
  components: {
    NavigationBar,
    NegotiationForm,
  },
  data() {
    return {
      isUserLoggedIn: false,
      authToken: "",
      profile: undefined,
    };
  },
  computed: {
    user() {
      return this.profile !== undefined ? this.profile.name : '';
    },
  },
  async mounted() {
    this.isUserLoggedIn = await this.$auth.isUserLoggedIn();
    if (this.isUserLoggedIn) {
      this.authToken = await this.$auth.getAccessToken();
      this.profile = await this.$auth.getProfile();
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