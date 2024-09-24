<template>
  <div class="error">
    <img
      class="image"
      :src="errorImage"
      alt=""
    >
    <div class="text">
      <h1>
        Sorry something went wrong
      </h1>
      <h5
        v-for="error in useNotifications.allNotifications"
        class="text-danger"
      >
        {{ error }}
      </h5>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
import { useUserStore } from "../store/user"
import { useNotificationsStore } from "../store/notifications"
import errorImage from "../assets/images/error-image.jpg"

const userStore = useUserStore()
const useNotifications = useNotificationsStore()

onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser()
  }
})
</script>

<style scoped>
.error {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

}
.text {
  position: absolute;
  top: 20vh;
}
.image{
  width: 50vw;
}

</style>
