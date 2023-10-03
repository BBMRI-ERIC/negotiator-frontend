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
        <div class="modal-header justify-content-center">
          <h4 class="modal-title">
            {{ title }}
          </h4>
        </div>
        <div class="modal-body">
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
        </div>
        <div class="modal-footer justify-content-center bg-primary">
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
