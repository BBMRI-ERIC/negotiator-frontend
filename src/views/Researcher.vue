<template>
  <navigation-bar />
  <div class="container">
    <NegotiationList :negotiations="negotiations"/>
  </div>
</template>
<script>

import NavigationBar from "@/components/NavigationBar.vue";
import NegotiationList from "@/components/NegotiationList.vue";
export default {
  name: "Researcher",
  components: {
    NavigationBar,
    NegotiationList
  },
  data() {
    return {
      negotiations: []
    }
  },
  created() {
    this.negotiations = [{
      id: 1,
      title: "This is my first dummy request"
    },
      {
      id: 2,
      title: "This is my second dummy request"
      }]
  }
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