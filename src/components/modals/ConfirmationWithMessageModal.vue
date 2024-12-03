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
        v-if="messageRequired"
        v-model="message"
        type="text"
        class="form-control"
      >
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-dark"
        data-bs-dismiss="modal"
        @click="message = ''"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        data-bs-dismiss="modal"
        :disabled="messageRequired && message == ''"
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
  },
  messageRequired: {
    type: Boolean
  }
})

const message = ref("")

const emit = defineEmits(["confirm"])

function emitConfirm () {
  console.log(message.value)
  emit("confirm", message.value)
}
</script>
