
<template>
  <header>
    <navigation-bar/>
  </header>
  <div class="container pt-4">
    <div v-if="notification !== undefined" class="row">
      <div col="12">
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
          ></button>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-2"></div>
      <div class="col-8">
        <router-view />
    </div>
      <div class="col-2"></div>
    </div>
  </div>
</template>

<script>
import { RouterView } from "vue-router";
import { mapGetters, mapMutations } from "vuex";

import NavigationBar from "./components/NavigationBar.vue";

export default {
  components: {
    RouterView,
    NavigationBar
  },
  computed: {
    ...mapGetters({ notification: "getNotification" })
  },
  methods: {
    ...mapMutations(['setNotification']),
    resetNotification () {
        this.setNotification(undefined)
    }
  }

  
}
</script>

<style scoped>
</style>
