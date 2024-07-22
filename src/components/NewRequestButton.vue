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
import { computed } from "vue"
import NewRequestModal from "@/components/modals/NewRequestModal.vue"
import allExternalLinks from "../config/externalLinks.js"
import { useStore } from "vuex"

const store = useStore()
const directoryPath = allExternalLinks.directory

async function startNewRequest () {
  if(import.meta.env.DEV){
    const data =  {
    "url": "https://bbmritestnn.gcc.rug.nl",
    "humanReadable": "#1: No filters used.\r\n#2: No filters used.\r\n#3: No filters used.\r\n#4: No filters used.\r\n#5: No filters used.",
    "resources": [{
        "id": "bbmri-eric:ID:CZ_MMCI:collection:LTS"
    }]
}

    await store.dispatch("createRequests", { data }).then((redirect) => {
      window.open(redirect.redirectUrl, '_blank');
  })
  }else{
  if (directoryPath) { window.open(directoryPath, "_blank") }
}
}
</script>
