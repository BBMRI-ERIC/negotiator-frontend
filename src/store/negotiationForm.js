import { defineStore } from "pinia"
import axios from "axios"
import { apiPaths, getBearerHeaders } from "../config/apiPaths"
import { useNotificationsStore } from "./notifications"

export const useNegotiationFormStore = defineStore("negotiationForm", () => {
  const notifications = useNotificationsStore()

  async function retrieveRequestById (requestId) {
    return await axios.get(`${apiPaths.REQUESTS_PATH}/${requestId}`, { headers: getBearerHeaders(requestId) })
      .then((response) => {
        // it handles the error when backend is unreachable but vite proxy strangely return 200
        if (response.data === "") {
          return { code: 500 }
        } else {
          return response.data
        }
      })
      .catch((error) => {
        notifications.setNotification("Error getting requestById request data from server")
        if (error.response) {
          return error.response.data
        }
      })
  }

  async function retrieveCombinedAccessForm (requestId) {
    return await axios.get(`${apiPaths.BASE_API_PATH}/requests/${requestId}/access-form`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting Combined Access Form request data from server")
        return null
      })
  }

  async function retrieveDynamicAccessFormsValueSetByID (id) {
    return await axios.get(`${apiPaths.VALUE_SETS}/${id}`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting value-sets request data from server")
        return null
      })
  }

  async function createNegotiation (data) {
    data.attachments = []
    for (const [sectionName, criteriaList] of Object.entries(data.payload)) {
      for (const [criteriaName, criteriaValue] of Object.entries(criteriaList)) {
        if (criteriaValue instanceof File) {
          const formData = new FormData()
          formData.append("file", criteriaValue)
          const uploadFileHeaders = { headers: getBearerHeaders() }

          uploadFileHeaders["Content-type"] = "multipart/form-data"

          const attachmentsIds = await axios.post("/api/v3/attachments", formData, uploadFileHeaders)
            .then((response) => {
              return response.data
            })
            .catch(() => {
              notifications.setNotification("There was an error saving the attachment")
              return null
            })
          data.payload[sectionName][criteriaName] = attachmentsIds
          data.attachments.push(attachmentsIds)
        }
      }
    }
    return axios.post(apiPaths.NEGOTIATION_PATH, data, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data.id
      })
      .catch(() => {
        notifications.setNotification("There was an error saving the Negotiation")
      })
  }

  return { retrieveRequestById, retrieveCombinedAccessForm, retrieveDynamicAccessFormsValueSetByID, createNegotiation }
})
