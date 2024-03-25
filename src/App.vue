<template>
  <v-tour
    v-show="$route.path !== '/' && vueTourFeatureFlag"
    name="myTour"
    :steps="steps"
  />

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
      vueTourFeatureFlag: allFeatureFlags.vueTour,
      steps: [
        {
          target: "#v-step-0", // We're using document.querySelector() under the hood
          header: {
            title: "Welcome"
          },
          content: "In the <strong>Negotiator</strong>, you can view the status of your negotiations and stay in contact with the providers of the desired resources."
        },
        {
          target: "#v-step-1",
          header: {
            title: "Selection of the view."
          },
          content: "You can present your enquiries in a compact table or an informative card layout."
        },
        {
          target: "#v-step-2",
          header: {
            title: "Status"
          },
          content: "You can see the current status of your enquiry at a glance."
        },
        {
          target: "#v-step-3",
          header: {
            title: "Filter"
          },
          content: "You also have the option of sorting and filtering your negotiations.",
          before: type => new Promise((resolve, reject) => {
            localStorage.setItem("show_vue_tour_1", true)
            resolve("foo")
          })
        }
      ]
    }
  },
  mounted: function () {
    // Do not display after the first visit so that returning users are not annoyed!
    if (!localStorage.getItem("show_vue_tour_1")) {
      this.$tours.myTour.start()
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
