<template>
  <div
    v-if="notification !== undefined"
    class="fixed-top mt-5 pt-3"
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
</template>

<script>
import { mapGetters, mapMutations } from "vuex"

export default {
  computed: {
    ...mapGetters({ notification: "getNotification" })
  },
  methods: {
    ...mapMutations(["setNotification"]),
    resetNotification () {
      this.setNotification(undefined)
    }
  },
  watch: {
    notification: function () {
      if (this.notification) {
        setTimeout(() => this.resetNotification(), 5000)
      }
    }
  }
}
</script>
