
<template>
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
      <div class="col-12">
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
  <div v-if="$route.path !== '/'" class="container">
    <div class="col-12">
      <footer
        class="bottom-0 p-0 w-100"
      >
        <hr class="mt-10 mb-10">
        <div class="row">
          <div class="col text-center">
            <p>&copy; 2023 BBMRI-ERIC</p>
          </div>
          <div class="col text-center">
            <img src="../src/assets/images/logo.svg">
          </div>
          <div class="col text-center">
            <i class="bi bi-github" />
            <a href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"> GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router"
import { mapGetters, mapMutations } from "vuex"

import NavigationBar from "./components/NavigationBar.vue"

export default {
  components: {
    RouterView,
    NavigationBar
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
  min-height: calc(100vh - 149px);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
  
  .body {
    min-height: calc(100vh - 169px);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
