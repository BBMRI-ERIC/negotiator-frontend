import { defineStore } from "pinia"
import axios from "axios"
import { apiPaths, getBearerHeaders } from "../config/apiPaths"
import { useNotificationsStore } from "./notifications"

export const useNegotiationPageStore = defineStore("negotiationPage", () => {
  const notifications = useNotificationsStore()

  function updateNegotiationStatus (negotiationId, event) {
    return axios.put(`${apiPaths.NEGOTIATION_PATH}/${negotiationId}/lifecycle/${event}`, {}, { headers: getBearerHeaders() })
      .then((response) => {
        notifications.setNotification(`Negotiation updated correctly with data ${response.data.id}`)
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error updating negotiation status")
        return null
      })
  }

  async function retrievePossibleEvents (negotiationId) {
    return axios.get(`${apiPaths.NEGOTIATION_PATH}/${negotiationId}/lifecycle`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting Possible Events data from server")
      })
  }

  function retrievePossibleEventsForResource (negotiationId, resourceId) {
    return axios.get(`${apiPaths.NEGOTIATION_PATH}/${negotiationId}/resources/${resourceId}/lifecycle`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting Possible Events For Resource data from server")
      })
  }
  
  function updateResourceStatus (link) {
    return axios.put(`${link}`, {}, { headers: getBearerHeaders() })
      .then((response) => {
        notifications.setNotification(`Than you. Your action for Negotiation ${response.data.id} was submitted successfully`)
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error updating negotiation status")
        return null
      })
  }

  async function retrieveNegotiationById (negotiationId) {
    return axios.get(`${apiPaths.NEGOTIATION_PATH}/${negotiationId}`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting request data from server")
      })
  }

  async function retrievePostsByNegotiationId (negotiationId, resourceId) {
    const url = `${apiPaths.NEGOTIATION_PATH}/${negotiationId}/posts`
    const params = resourceId ? { resource: resourceId } : {}
    return await axios.get(url, { headers: getBearerHeaders(), params })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting Negotiation Posts data from server")
      })
  }

  async function retrieveAttachmentsByNegotiationId (negotiationId) {
    const url = `${apiPaths.NEGOTIATION_PATH}/${negotiationId}/attachments`
    return await axios.get(url, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting Negotiation Attachments data from server")
      })
  }

  async function addMessageToNegotiation (data) {
    return await axios.post(`${apiPaths.NEGOTIATION_PATH}/${data.negotiationId}/posts`, data, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error sending message")
      })
  }

  async function addAttachmentToNegotiation (data) {
    const formData = new FormData()
    const uploadFileHeaders = { headers: getBearerHeaders() }
    if (data.organizationId != null) {
      formData.append("organizationId", data.organizationId)
    }
    formData.append("file", data.attachment)
    uploadFileHeaders["Content-type"] = "multipart/form-data"

    return await axios.post(`${apiPaths.NEGOTIATION_PATH}/${data.negotiationId}/attachments`, formData, uploadFileHeaders)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("There was an error saving the attachment")
        return null
      })
  }

  function retrieveUserRepresentedResources () {
    return axios.get(apiPaths.USER_RESOURCES_PATH, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting User Represented Resources data from server")
      })
  }

  function downloadAttachment (id, name) {
    axios.get(`${apiPaths.ATTACHMENTS_PATH}/${id}`, { headers: getBearerHeaders(), responseType: "blob" })
      .then((response) => {
        const href = window.URL.createObjectURL(response.data)

        const anchorElement = document.createElement("a")
        anchorElement.href = href
        anchorElement.download = name

        document.body.appendChild(anchorElement)
        anchorElement.click()

        document.body.removeChild(anchorElement)
        window.URL.revokeObjectURL(href)
      })
  }

  function retrieveResourcesByNegotiationId (negotiationId) {
    return axios.get(`${apiPaths.NEGOTIATION_PATH}/${negotiationId}/resources`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data._embedded.resources
      })
      .catch(() => {
        notifications.setNotification("Error getting request data from server")
      })
  }

  function downloadAttachmentFromLink (href) {
    axios.get(`${href}`, { headers: getBearerHeaders(), responseType: "blob" })
      .then((response) => {
        const disposition = response.headers["Content-Disposition"]
        let filename = "summary.csv"
        console.log(response.headers)
        if (disposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
          const matches = filenameRegex.exec(disposition)
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, "")
          }
        }
        const href = window.URL.createObjectURL(response.data)

        const anchorElement = document.createElement("a")
        anchorElement.href = href
        anchorElement.download = filename

        document.body.appendChild(anchorElement)
        anchorElement.click()

        document.body.removeChild(anchorElement)
        window.URL.revokeObjectURL(href)
      })
  }

  function retrieveInformationSubmission (href) {
    return axios.get(`${href}`, { headers: getBearerHeaders() })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        notifications.setNotification("Error getting Information Submission data from server")
      })
  }

  return { 
    updateNegotiationStatus,
    retrievePossibleEvents,
    retrievePossibleEventsForResource,
    updateResourceStatus,
    retrieveNegotiationById,
    retrievePostsByNegotiationId,
    retrieveAttachmentsByNegotiationId,
    addMessageToNegotiation, addAttachmentToNegotiation,
    retrieveUserRepresentedResources,
    downloadAttachment,
    retrieveResourcesByNegotiationId,
    downloadAttachmentFromLink,
    retrieveInformationSubmission
    }
})
