<template>
  <div class="container">
    <NegotiationList :negotiations="negotiations"/>
  </div>
</template>
<script>

import NegotiationList from "@/components/NegotiationList.vue";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "Researcher",
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

<style scoped>
.container{
  max-width: 1000px;
  margin: 30px auto;
  overflow: auto;
  min-height: 200px;
  text-align: center;
  padding: 30px;
}
</style>