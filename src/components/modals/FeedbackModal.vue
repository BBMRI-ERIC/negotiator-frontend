<template> 
  <NegotiatorModal
    :id="id"
    :title="title"
    :fade="fade"
  >
    <template #body>
      <p>
        {{ text }}
      </p>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="emitDismiss"
      >
        {{ dismissButtonText }}
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
    },
    fade: {
      type: Boolean,
      default: false
    },
    dismissButtonText: {
      type: String,
      default: "OK"
    }
  },
  emits: ["dismiss"],
  methods: {
    emitDismiss() {
      this.$emit("dismiss")
    }
  }
}
</script>
