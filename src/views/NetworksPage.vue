<template>
  <div v-if="!loading">
    <h1>{{ props.networkId }}</h1>
  </div>
  <LoadingSpinner v-else: />
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useNetworksPageStore } from "@/store/networksPage"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { useRoute } from "vue-router"

const props = defineProps({
  networkId: {
    type: String,
    required: true
  }
})
const route = useRoute()
const networksPageStore = useNetworksPageStore()
const network = ref(undefined)
const loading = computed(() => {
  return network.value === undefined
})
onMounted(async () => {
  loadNetworkInfo(props.networkId)
})

async function loadNetworkInfo (networkId) {
  network.value = await networksPageStore.retrieveNetwork(networkId)
}
</script>
