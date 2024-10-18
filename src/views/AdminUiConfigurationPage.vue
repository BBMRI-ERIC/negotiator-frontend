<template>
    <div class="footer mb-2">
        <span class="mb-5 text-left fw-bold h3">
            Footer Settings
        </span>
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
import { ref, watch } from "vue";
import UiConfigurationSetting from "../components/UiConfigurationSetting.vue"
import { useUiConfiguration } from '../store/uiConfiguration.js'


const uiConfigurationStore = useUiConfiguration()
const uiConfiguration = ref({})

retriveUiConfiguration()

async function retriveUiConfiguration() {
    uiConfiguration.value = await uiConfigurationStore.getUiConfiguration()
    uiConfiguration.value.footer.isFooterHelpLinkVisible = "#ae0a0a"
}

watch(uiConfiguration, () => {
    uiConfigurationStore.uiConfiguration =  uiConfiguration.value
},
{ deep: true },
)
</script>