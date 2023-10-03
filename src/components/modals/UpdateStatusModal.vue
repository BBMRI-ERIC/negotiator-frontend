<template>
  <NegotiationModal
    :id="id"
    :title="`Resource: ${resourceId}`"
  >
    <template #body>
      <label
        class="form-label"
      >Select new status: </label>
      <select
        v-model="selectedItem"
        class="form-select"
      >
        <option
          v-for="response in options"
          :key="response"
          :value="response"
        >
          {{ response }}
        </option>
      </select>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-info"
        data-bs-dismiss="modal"
      >
        Close
      </button>
      <button
        type="button"
        class="btn btn-secondary"
        data-bs-dismiss="modal"
        @click="emitSelected"
      >
        Submit
      </button>
    </template>
  </NegotiationModal>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    resourceId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  emits: ["selected"],
  data() {
    return {
      selectedItem: "",
    }
  },
  methods: {
    emitSelected () {
      this.$emit("selected", this.selectedItem)
    }
  }
}
</script>
