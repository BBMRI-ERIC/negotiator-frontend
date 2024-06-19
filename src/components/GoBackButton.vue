<template>
  <button
    type="button"
    class="btn btn-primary"
    @click="goBack()"
  >
    <i class="bi-arrow-left" />
    Go back
  </button>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

function goBack () {
  if (router.options.history.state.back) {
    router.go(-1)
  } else {
    router.push({
      name: "home"
    })
  }
}
</script>
