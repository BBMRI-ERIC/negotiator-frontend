import { defineStore } from "pinia"
import axios from "axios"
import { apiPaths, getBearerHeaders } from "../config/apiPaths"
import { useNotificationsStore } from "./notifications"

export const useNetworksPageStore = defineStore("networksPage", () => {
  const notifications = useNotificationsStore()

  function retrieveNetworkNegotiations (networkId) {
    return axios.get(`${apiPaths.BASE_API_PATH}/networks/${networkId}/negotiations`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting request data from server")
        return []
      })
  }
  async function retrieveUserNetworks (userId) {
    return await axios.get(`${apiPaths.BASE_API_PATH}/users/${userId}/networks`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data._embedded.networks
      })
  }

  return {
    retrieveNetworkNegotiations,
    retrieveUserNetworks
  }
})
