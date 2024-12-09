import { defineStore } from "pinia"
import axios from "axios"
import { apiPaths, getBearerHeaders } from "../config/apiPaths"
import { useNotificationsStore } from "./notifications"

export const useOrganizationsStore = defineStore("organizations", () => {
  const notifications = useNotificationsStore()

  function retrieveOrganizations () {
    return axios.get(`${apiPaths.BASE_API_PATH}/organizations`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data._embedded
      })
      .catch(() => {
        notifications.setNotification("Error getting all organizations data from server", 'warning')
      })
  }

  function retrieveOrganizationById (organizationsId) {
    return axios.get(`${apiPaths.BASE_API_PATH}/organizations/${organizationsId}`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting organization data from server", 'warning')
      })
  }

  return { retrieveOrganizations, retrieveOrganizationById }
})
