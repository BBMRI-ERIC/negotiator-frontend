<template>
    <negotiation-form
        :requestId="$route.params.requestId"
    ></negotiation-form>
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