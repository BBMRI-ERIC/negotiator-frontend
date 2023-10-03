
<template>
  <div class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <h3 class="modal-header">
          Are you sure you want to abandon this Negotiation?
        </h3>
        <div class="modal-body">
          <p>
            This is means that you will not be able to access this negotiation again.
          </p>
        </div>
        <div class="modal-footer justify-content-center bg-primary">
          <button
            type="button"
            class="btn btn-info"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-secondary"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["close-confirmation-modal", "abandon-negotiation"],
  methods: {
    closeModal() {
      this.$emit("close-confirmation-modal")
    }
  }
}
</script>
