<template>
     <div class="navbar mb-2 flex row">
        <div class="mb-3 text-left fw-bold h3">
            Navbar Settings
        </div>
        <div class="navbarConfig row">
            <UiConfigurationSetting v-model="uiConfiguration.navbar" />
        </div>
    </div>
    <div class="footer mb-2">
        <div class="mb-3 text-left fw-bold h3">
            Footer Settings
        </div>
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
import { computed } from "vue";
import UiConfigurationSetting from '../components/UiConfigurationSetting.vue'
import { useUiConfiguration } from '../store/uiConfiguration.js'

const uiConfigurationStore = useUiConfiguration()

const uiConfiguration = computed(() => {
  return uiConfigurationStore.uiConfiguration
})
</script>