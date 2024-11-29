<template>
    <div class="container">
        <div>Name: {{ organization.name }}</div>
        <div>Id: {{ organization.id }}</div>
        <div>External id: {{ organization.externalId }}</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useUserStore } from "../store/user.js"
import { useOrganizationsStore } from "../store/organizations.js"

const props = defineProps({
    organizationId: {
    type: Number,
    default: undefined
  }
})

const userStore = useUserStore()
const organizationsStore = useOrganizationsStore()
const organization = ref({})

onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser()
  }

  organization.value = await organizationsStore.retrieveOrganizationById(props.organizationId)
})
</script>