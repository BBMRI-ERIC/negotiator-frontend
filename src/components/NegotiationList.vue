<template>
  <header>
    <h3>
      List of your ongoing negotiations:
    </h3>
  </header>
  <div :key="negotiation.id" v-for="negotiation in negotiations">
    <Negotiation :negotiation="negotiation"/>
  </div>
</template>

<script>
import Negotiation from "@/components/Negotiation.vue";
export default {
  name: "NegotiationsList",
  props: {
    negotiations: Array
  },
  components: {
    Negotiation
  }
}

</script>

<style scoped>

</style>