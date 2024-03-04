<template>
  <div>
    <button
      ref="openModal"
      class="btn btn-sm bg-warning sm my-2 float-end"
      data-bs-toggle="modal"
      data-bs-target="#newRequestModal"
    >
      <span class="text-white">New Request</span>
    </button>
    <NewRequestModal
      id="newRequestModal"
      :is-modal-small="true"
      :title="'New Request'"
      :text="'You will be redirected to our Metadata catalogue where you can select which collections you want to contact.'"
      dismiss-button-text="Back to HomePage"
      @confirm="startNewRequest"
    />
  </div>
</template>

<script>
import NewRequestModal from "@/components/modals/NewRequestModal.vue"
import allExternalLinks from "../config/externalLinks.js"

export default {
  name: "NewRequestButton",
  components: {
    NewRequestModal
  },
  data () {
    return {
      directoryPath: allExternalLinks.directory
    }
  },
  methods: {
    startNewRequest () {
      if (this.directoryPath) { window.open(this.directoryPath, "_blank") }
    }
  }
}
</script>
