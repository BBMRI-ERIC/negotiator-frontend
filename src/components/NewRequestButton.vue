<template>
  <div>
    <button
      ref="openModal"
      class="btn btn-sm bg-new-request-button-color sm my-2 float-end"
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

<script setup>
import NewRequestModal from "@/components/modals/NewRequestModal.vue"
import allExternalLinks from "../config/externalLinks.js"

const directoryPath = allExternalLinks.directory

function startNewRequest () {
  if (directoryPath) { window.open(directoryPath, "_blank") }
}
</script>
