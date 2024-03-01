<template>
  <NegotiatorModal
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
        class="btn btn-dark"
        data-bs-dismiss="modal"
      >
        Cancel
      </button>
      <button
        type="button"
        class="btn btn-danger"
        data-bs-dismiss="modal"
        @click="emitConfirm"
      >
        Confirm
      </button>
    </template>
  </NegotiatorModal>
</template>

<script>

import NegotiatorModal from "./NegotiatorModal.vue"

export default {
  components: { NegotiatorModal },
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
    emitConfirm () {
      this.$emit("confirm")
    }
  }
}
</script>
