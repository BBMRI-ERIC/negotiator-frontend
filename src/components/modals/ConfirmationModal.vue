<template>
  <NegotiationModal
    :id="id"
    :title="title"
  >
    <template #body>
      <p>
        {{ text }}
      </p>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-info"
        data-bs-dismiss="modal"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="emitConfirm"
      >
        Confirm
      </button>
    </template>
  </NegotiationModal>
</template>

<script>
import NegotiationModal from "./NegotiationModal.vue"

export default {
  components: { NegotiationModal },
  props: {
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
  },
  emits: ["confirm"],
  methods: {
    emitConfirm() {
      this.$emit("confirm")
    }
  }
}
</script>
