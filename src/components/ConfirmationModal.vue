
<template>
  <div
    class="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <h1 class="modal-header">
          Are you sure you want to abandon this Negotiation?
        </h1>
        <div class="modal-body">
          <p>
            This is means that you will not be able to access this negotiation again.
          </p>
          <div class="modal-footer justify-content-center">
            <button
              class="btn btn-secondary"
              @click="closeModal"
            >
              No
            </button>
            <button
              class="btn btn-danger"
              @click="closeModal; $emit('abandon-negotiation')"
            >
              Yes
            </button>
          </div>
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

<style scoped>
.modal {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
  border-radius: 10px;
  z-index: 1;
}
</style>