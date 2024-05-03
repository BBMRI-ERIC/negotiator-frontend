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

<script setup>
import { computed, watch } from "vue"
import { useStore } from "vuex"

const store = useStore()

const notification = computed(() => {
  return store.getters.getNotification
})

function resetNotification () {
  store.commit("setNotification", undefined)
}

watch(notification, () => {
  if (notification.value) {
    setTimeout(() => resetNotification(), 5000)
  }
})
</script>
