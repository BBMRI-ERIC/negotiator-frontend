<template>
  <navigation-bar />
  <div class="container">
    <NegotiationList :negotiations="negotiations"/>
  </div>
</template>
<script>

import NavigationBar from "@/components/NavigationBar.vue";
import NegotiationList from "@/components/NegotiationList.vue";
import {mapActions, mapGetters} from "vuex";
export default {
  name: "Researcher",
  components: {
    NavigationBar,
    NegotiationList
  },
  methods: {
    ...mapActions(["retrieveNegotiations"])
  },
  computed: {
    ...mapGetters({
      negotiations: "getNegotiations",
    })
  },
  async mounted() {
    const token = await this.$auth.getAccessToken();
    await this.retrieveNegotiations({
      token
    });
    console.log(this.negotiations)
  },
}
</script>

<style scoped>
.container{
  max-width: 1000px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  text-align: center;
  border: 1px solid #ec6707;
  padding: 30px;
  border-radius: 5px;
}
</style>