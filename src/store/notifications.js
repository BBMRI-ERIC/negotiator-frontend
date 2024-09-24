import { ref, watch } from "vue"
import { defineStore } from "pinia"

export const useNotificationsStore = defineStore("notifications", () => {
  const notification = ref(undefined)
  const allNotifications = ref([])
  const criticalError = ref(false)

  function setNotification (notificationMessage) {
    notification.value = notificationMessage
    if (notificationMessage) {
      allNotifications.value.push(notificationMessage)
    }
  }

  function resetNotification () {
    notification.value = undefined
  }

  watch(notification, () => {
    if (notification.value) {
      setTimeout(() => resetNotification(), 5000)
    }
  })

  return { notification, allNotifications, criticalError, setNotification, resetNotification }
})
