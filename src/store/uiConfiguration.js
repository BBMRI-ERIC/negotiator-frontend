import { ref } from "vue"
import { defineStore } from "pinia"
import axios from "axios"
import { apiPaths, getBearerHeaders } from "../config/apiPaths"
import { useNotificationsStore } from "./notifications"

export const useUiConfiguration = defineStore("uiConfiguration", () => {
  const notifications = useNotificationsStore()
  const uiConfiguration = ref({})

  function retrieveUiConfiguration() {
    return axios.get(`${apiPaths.BASE_API_PATH}/ui-config`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting UI Configuration data from server")
        return null
      })
  }

  async function getUiConfiguration() {
    if (Object.keys(uiConfiguration.value).length === 0) {
      uiConfiguration.value = await retrieveUiConfiguration()
    }
    return uiConfiguration.value
  }

  return {
    uiConfiguration,
    retrieveUiConfiguration,
    getUiConfiguration
  }
})