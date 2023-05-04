<template>
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
</template>

<script>
import NegotiationForm from "@/components/NegotiationForm.vue";

export default {
  name: "home-page",
  components: {
    NegotiationForm,
  }
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