<template>
  <div class="negotiation">
    <div class="object-title">Request title:{{ negotiation.title }}</div>
    <div class="object-id">Request id:{{ negotiation.id }}</div>
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
.negotiation {
  display: flex;
  justify-content: space-between;
}

.object-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.object-id {
  font-size: 1rem;
  color: #999;
}
.object-details {
  position:relative;
  top:0;
  right:0;
}
</style>