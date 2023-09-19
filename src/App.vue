
<template>
  <header>
    <navigation-bar v-if="hideNavBar" />
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
      <div class="col-10">
        <router-view :key="$route.path" />
      </div>
      <div class="col-1" />
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
    ...mapGetters({ notification: "getNotification" }),
    hideNavBar() {
      return !(this.$route.path === "/")
    }
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
}
</style>
