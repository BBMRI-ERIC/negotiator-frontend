<template>
  <div class="dropdown">
    <button
      type="button"
      class="btn btn-sm btn-outline-primary rounded-circle position-relative py-0 px-1"
      :class="getAllNotifications.length > 0 ? '' : 'disabled'"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      @click="resetNotification"
    >
      <i class="bi bi-bell" />

      <span
        v-if="getAllNotifications.length > 0"
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger pb-0 px-1"
      >
        {{ getAllNotifications.length }}
      </span>
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li class="dropdown-item alert-warning">
        Notifications:
      </li>
      <li><hr class="dropdown-divider"></li>
      <li
        v-for="notification in getAllNotifications"
        :key="notification"
        class="dropdown-item"
      >
        <div
          class="alert alert-warning mb-1"
          role="alert"
        >
          {{ notification }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"

const store = useStore()

const getAllNotifications = computed(() => {
  return store.getters.getAllNotifications
})

async function resetNotification () {
  await store.commit("setNotification", undefined)
}
</script>

<style scoped>
.dropdown-menu {
  overflow: hidden;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
}
</style>
