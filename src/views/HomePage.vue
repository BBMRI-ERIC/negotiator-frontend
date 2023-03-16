<template>
  <header>
    <navigation-bar :user="user" />
  </header>
  <div class="container pt-4">
    <div v-if="notification !== undefined" class="row">
      <div col="12">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {{ notification }}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            @click="resetNotification"
          ></button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <negotiation-form
          v-if="$route.params.requestId"
          :requestId="$route.params.requestId"
        ></negotiation-form>
        <div v-else>
          <div class="jumbotron">
            <h1 class="display-4">Welcome to the BBMRI Negotiator</h1>
            <p class="lead">
              The BBMRI-ERIC Negotiator is a Service that provides an efficient
              communication platform for biobankers and researchers requesting
              samples and/or data. It substantially simplifies the communication
              steps that are necessary to obtain information on the availability
              of relevant samples/data, particularly if the researchers need to
              communicate with multiple candidate biobanks.
            </p>
            <hr class="my-4" />
          </div>
        </div>
      </div>
      <div class="col-2"></div>
    </div>
  </div>
</template>

<script>
import NegotiationForm from "@/components/NegotiationForm.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import { mapGetters, mapMutations } from "vuex";

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
      userClaims: undefined,
    };
  },
  computed: {
    ...mapGetters({ notification: "getNotification" }),
    user() {
      return this.userClaims !== undefined ? this.userClaims.name : "";
    },
  },
  methods: {
    ...mapMutations(['setNotification']),
    resetNotification () {
        this.setNotification(undefined)
    }
  },
  async mounted() {
    this.isUserLoggedIn = await this.$auth.isUserLoggedIn();
    if (this.isUserLoggedIn) {
      this.authToken = await this.$auth.getAccessToken();
      this.profile = await this.$auth.getProfile();
      this.userClaims = await this.$auth.getClaims();
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