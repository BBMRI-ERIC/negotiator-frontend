<template>
  <div />
</template>

<script setup>
import { onMounted } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

onMounted(() => {
  oidcSignInCallback()
})

async function oidcSignInCallback () {
  await store.dispatch("oidcSignInCallback").then((redirectPath) => {
    router.push(redirectPath)
  }).catch((err) => {
    console.error(err)
    router.push("/oidc-callback-error") // Handle errors any way you want
  })
}
</script>
