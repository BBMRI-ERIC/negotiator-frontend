<template>
  <header>
    <navigation-bar :user="user" />
  </header>
  <div class="container pt-4">
    <div class="row">
      <div class="col-4"></div>
      <div class="col-4">
        <negotiation-form
          v-if="$route.params.requestId"
          :requestId="$route.params.requestId"
        ></negotiation-form>
        <div v-else>
            Start negotiation by performing a query in the service you have to chose
        </div>
      </div>
      <div class="col-4"></div>
    </div>
  </div>
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
      return this.profile !== undefined ? this.profile.name : "";
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