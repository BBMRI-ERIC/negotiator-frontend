<template>
    <confirmation-modal
      id="saveModal"
      title="Are you sure you want to save?"
      text="Confirming, you will change ui-configuration."
      @confirm="save()"
    />
    <div class="ui-configuration">
     <div class="nav-bar mb-2">
        <div class="mb-3 text-left fw-bold h3">
            Navbar Settings
            <button class="btn btn-sm btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                <i class="bi bi-database-fill-gear"/> Click to Edit
            </button>
        </div>
        <div class="navbarConfig row collape show" id="collapse1">
            <UiConfigurationSetting v-model="uiConfiguration.navbar" />
        </div>
    </div>
    <div class="login mb-2">
        <div class="mb-3 text-left fw-bold h3">
            Login page Settings
            <button class="btn btn-sm btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                <i class="bi bi-database-fill-gear"/> Click to Edit
            </button>
        </div>
        <div class="loginConfig row collapse" id="collapse2">
            <UiConfigurationSetting v-model="uiConfiguration.login" />
            <HomePage :isUiConfigActive="true" />
        </div>
    </div>
    <div class="footer mb-2">
        <div class="mb-3 text-left fw-bold h3">
            Footer Settings
            <button class="btn btn-sm btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                <i class="bi bi-database-fill-gear"/> Click to Edit
            </button>
        </div>
        <div class="footerConfig row collapse" id="collapse3">
            <UiConfigurationSetting v-model="uiConfiguration.footer" />
        </div>
    </div>
</div>
    <div class="sticky-bottom pb-3">
        <button class="btn btn-sm bg-primary sm my-2" v-on:click="restartSettings()">
            <i class="bi bi-arrow-clockwise text-white">Restart to default</i>
        </button>
        <button class="btn btn-sm bg-primary sm my-2 float-end"     
            data-bs-toggle="modal"
            data-bs-target="#saveModal"
        >
        <i class="bi bi-floppy text-white"> Save Changes </i>
        </button>
    </div>
</template>

<script setup>
import { computed } from "vue";
import UiConfigurationSetting from '../components/UiConfigurationSetting.vue'
import { useUiConfiguration } from '../store/uiConfiguration.js'
import HomePage from "../views/HomePage.vue"

import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"

const uiConfigurationStore = useUiConfiguration()

const uiConfiguration = computed(() => {
  return uiConfigurationStore.uiConfiguration
})

function restartSettings() {
    uiConfigurationStore.retrieveUiConfiguration()
}

function save() {
    uiConfigurationStore.updateUiConfiguration(uiConfiguration.value)
}

</script>

<style scoped>
.ui-configuration {
    min-height: 70vh;
}
</style>