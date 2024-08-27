<template>
  <button
    type="button"
    class="btn"
    @click="openModal()"
  >
    <i class="bi bi-pencil-square" />
    Edit
  </button>
  <add-resources-modal
    id="resourcesModal"
    :shown="shown"
    :negotiation-id="props.negotiationId"
    @confirm="closeModal()"
  />
</template>
<script setup>
import AddResourcesModal from "@/components/modals/AddResourcesModal.vue"
import { Modal } from "bootstrap"
import { ref } from "vue"
const shown = ref(false)
const resourceModal = ref(undefined)
const props = defineProps({
  negotiationId: {
    type: String,
    required: true
  }
})
const emit = defineEmits(["new-resources"])
function openModal () {
  resourceModal.value = new Modal(document.querySelector("#resourcesModal"))
  shown.value = true
  resourceModal.value.show()
}
function closeModal () {
  emit("new-resources")
  resourceModal.value.hide()
}
</script>

<style scoped>

</style>
