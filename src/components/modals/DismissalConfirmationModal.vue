<template>
  <NegotiatorModal
    :id="id"
    :title="title"
  >
    <template #body>
      <div class="mb-2">
        {{ text }}
      </div>
      <input
        v-model="details"
        type="text"
        class="form-control"
      >
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-dark"
        data-bs-dismiss="modal"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        data-bs-dismiss="modal"
        :disabled="details == ''"
        @click="emitConfirm"
      >
        Confirm
      </button>
    </template>
  </NegotiatorModal>
</template>

<script setup>
import NegotiatorModal from "./NegotiatorModal.vue"
import { ref } from "vue"

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})

const details = ref("")

const emit = defineEmits(["confirm"])

function emitConfirm () {
  emit("confirm", details.value)
}
</script>
