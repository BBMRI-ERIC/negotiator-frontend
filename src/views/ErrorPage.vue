<template>
  <div class="error-page d-flex flex-column justify-content-center align-items-center">
    <h1 class="text-title">
      Sorry something went wrong
    </h1>
    <div class="image-text-box">
      <div class="errors-text">
        <h5
          v-for="error in useNotifications.allNotifications"
          class="text-warning"
        >
          {{ error.message }}
        </h5>
      </div>
      <img
        class="image"
        :src="errorImage"
        alt="error image"
      >
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
.text-title {
  position: absolute;
  top: 20vh;
  width: auto;
  text-wrap: nowrap;
}
.image-text-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.errors-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15vh;
}
.image {
  width: 50vw;
}
@media screen and (max-width: 480px) {
  .image {
    display: none;
  }
}
</style>
