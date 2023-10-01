
<template>
  <header>
    <navigation-bar />
  </header>
  <div class="container pt-4 main-container">
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
      <div class="col-1" />
      <div class="col-12">
        <router-view :key="$route.path" />
      </div>
      <div class="col-1" />
    </div>
  </div>
  <div class="container">
    <div class="col-12">
      <footer>
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
.main-container {
  min-width: 25rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.box {
  inline-size: 300px;
}

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

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
  footer {
    padding: 10px;
    bottom: 0;
    width: 100%;
  }
}
</style>
