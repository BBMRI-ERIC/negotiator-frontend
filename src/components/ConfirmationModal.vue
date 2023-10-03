
<template>
  <div
    :id="id"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="{{id}}Label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <h4 class="modal-header">
          {{ title }}
        </h4>
        <div class="modal-body">
          <p>
            {{ text }}
          </p>
        </div>
        <div class="modal-footer justify-content-center bg-primary">
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
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
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
