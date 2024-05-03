<template>
  <VueTour v-show="$route.fullPath !== '/' && vueTourFeatureFlag" />

  <header>
    <navigation-bar />
  </header>
  <div
    v-if="$route.path !== '/'"
    class="mt-5 pt-4"
  >
    <Alert />
&nbsp;
  </div>
  <div class="container body d-flex flex-column">
    <div class="row">
      <div
        id="v-step-0"
        class="col-12"
      >
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
  <div
    v-if="$route.path !== '/'"
    class="container"
  >
    <div class="col-12">
      <Footer />
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router"
import allFeatureFlags from "@/config/featureFlags.js"

import VueTour from "./components/VueTour.vue"
import NavigationBar from "./components/NavigationBar.vue"
import Alert from "./components/Alert.vue"
import Footer from "./components/Footer.vue"

export default {
  components: {
    RouterView,
    NavigationBar,
    Footer,
    Alert
  },
  data () {
    return {
      vueTourFeatureFlag: !!(allFeatureFlags.vueTour === "true" || allFeatureFlags.vueTour === true)
    }
  }
}
</script>

<style scoped>

.box {
  inline-size: 300px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.body {
  min-height: calc(100vh - 391px);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .body {
    min-height: calc(100vh - 263px);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
