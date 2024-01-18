
<template>
  <v-tour name="myTour" :steps="steps"></v-tour>

  <header>
    <navigation-bar />
  </header>
  <div v-if="$route.path !== '/'" class="mt-5 pt-4">&nbsp;</div>

  <div class="container body d-flex flex-column">
    <div
      v-if="notification !== undefined"
      class="row"
    >
      <div class="col-12">
        <div
          class="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {{ notification }}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            @click="resetNotification"
          />
        </div>
      </div>
    </div>
    <div class="row">
      <div id="v-step-0" class="col-12">
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
  <div v-if="$route.path !== '/'" class="container">
    <div class="col-12">
      <Footer />
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router"
import { mapGetters, mapMutations } from "vuex"

import NavigationBar from "./components/NavigationBar.vue"
import Footer from "./components/Footer.vue"


export default {
  components: {
    RouterView,
    NavigationBar,
    Footer
  },
  data () {
      return {
        steps: [
          {
            target: '#v-step-0',  // We're using document.querySelector() under the hood
            header: {
              title: 'Get Started',
            },
            content: `Discover <strong>Vue Tour</strong>!`
          },
          {
            target: '.v-step-1',
            content: 'An awesome plugin made with Vue.js!',
            before: type => new Promise((resolve, reject) => {
              this.$router.push("/biobanker")

            // Time-consuming UI/async operation here
            resolve('foo')
            })
          },
          {
            target: '[data-v-step="2"]',
            content: 'Try it, you\'ll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.',
            params: {
              placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
            }
          }
        ]
      }
    },
  mounted: function () {
    // TODO: Hide me after the first visit so returning users don't get annoyed!
    if(!localStorage.getItem('show_vue_tour')){
      localStorage.setItem('show_vue_tour', true)
      this.$tours['myTour'].start()
    }
  },
  computed: {
    ...mapGetters({ notification: "getNotification" })
  },
  methods: {
    ...mapMutations(["setNotification"]),
    resetNotification () {
      this.setNotification(undefined)
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
