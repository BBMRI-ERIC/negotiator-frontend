<template>
    <div class="footer">
        <span class="mb-5 text-left fw-bold h3">
            Footer Settings
        </span>
        <button class="btn btn-sm bg-none sm my-2 ">
            <span class="text-white">Expand</span> <i class="bi bi-chevron-down"></i>

        </button>
        <div class="footerConfig row">
            <UiConfigurationSetting v-model="uiConfiguration.footer" />
        </div>
    </div>
    <div>
        <button class="btn btn-sm bg-primary sm my-2">
            <span class="text-white" v-on:click="retriveUiConfiguration()">Restart Settings to default</span>
        </button>
        <button class="btn btn-sm bg-primary sm my-2 float-end">
            <span class="text-white">Save Changes</span>
        </button>
    </div>
</template>

<script setup>
import { ref } from "vue";
import UiConfigurationSetting from "../components/UiConfigurationSetting.vue"
import { useUiConfiguration } from '../store/uiConfiguration.js'


const uiConfigurationStore = useUiConfiguration()
const uiConfiguration = ref({})

retriveUiConfiguration()

function retriveUiConfiguration() {
    uiConfigurationStore.retrieveUiConfiguration().then(() => {
        uiConfiguration.value = uiConfigurationStore.uiConfiguration
        uiConfiguration.value.footer.isFooterHelpLinkVisible = "#ae0a0a"
    })
}



</script>