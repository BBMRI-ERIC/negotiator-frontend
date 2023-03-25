<template>
  <div class="negotiation">
    <h3>Request title: {{ negotiation.title }}</h3>
  </div>

</template>

<script>

export default {
  name: "Negotiation",
  props: {
    negotiation: Object
  }
}
</script>

<style scoped>
.negotiation {
  background: #f4f4f4;
  margin: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
.negotiation h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>