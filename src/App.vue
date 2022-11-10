
<template>
  <header>
    <navigation-bar />
  </header>
  <router-view />
</template>

<script>
import { RouterView } from "vue-router";
import NavigationBar from "./components/NavigationBar.vue";

export default {
  components: {
    RouterView,
    NavigationBar,
  },
}
</script>

<style scoped>
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
}
</style>
