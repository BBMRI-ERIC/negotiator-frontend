<template>
  <button
    type="button"
    class="btn"
    @click="openModal()"
  >
    <i class="bi bi-plus-circle" />
    Add
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
const props = defineProps({
  negotiationId: {
    type: String,
    required: true
  }
})
const emit = defineEmits(["new-resources"])
function openModal () {
  const resourcesModal = new Modal(document.querySelector("#resourcesModal"))
  shown.value = true
  resourcesModal.show()
}
function closeModal () {
  emit("new-resources")
  this.resourcesModal.hide()
}
</script>

<style scoped>

</style>
