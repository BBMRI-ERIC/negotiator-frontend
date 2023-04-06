
<template>
  <header>
    <navigation-bar/>
  </header>
  <router-view />
</template>

<script>
import { RouterView } from "vue-router";
import NavigationBar from "./components/NavigationBar.vue";

export default {
  components: {
    RouterView,
    NavigationBar
  }
}
</script>

<style scoped>
</style>
