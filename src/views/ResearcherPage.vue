<template>
    <NegotiationList :negotiations="negotiations"/>
</template>
<script>

import NegotiationList from "@/components/NegotiationList.vue";
import {mapActions, mapGetters} from "vuex";
export default {
  components: {
    NegotiationList
  },
  methods: {
    ...mapActions(["retrieveResearcherRoleNegotiations"])
  },
  computed: {
    ...mapGetters({
      negotiations: "getNegotiations",
    })
  },
  async mounted() {
    await this.retrieveResearcherRoleNegotiations();
    console.log(this.negotiations)
  },
}
</script>