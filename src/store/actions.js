import { ROLES } from "@/config/consts"
import axios from "axios"

const BASE_API_PATH = "/api/v3"
const ACCESS_CRITERIA_PATH = `${BASE_API_PATH}/access-criteria`
const REQUESTS_PATH = `${BASE_API_PATH}/requests`
const NEGOTIATION_PATH = `${BASE_API_PATH}/negotiations`
const USER_PATH = `${BASE_API_PATH}/users`
const USER_ROLES_PATH = `${BASE_API_PATH}/users/roles`
const USER_RESOURCES_PATH = `${BASE_API_PATH}/users/resources`
const ATTACHMENTS_PATH = `${BASE_API_PATH}/attachments`
const BACKEND_VERSION_PATH = "/api/actuator/info"

function getBearerHeaders (token) {
  return { Authorization: `Bearer ${token}` }
}

export default {
  retrieveRequestById (store, { requestId }) {
    return axios.get(`${REQUESTS_PATH}/${requestId}`)
      .then((response) => {
        // it handles the error when backend is unreachable but vite proxy strangely return 200
        if (response.data === "") {
          return { code: 500 }
        } else {
          return response.data
        }
      })
      .catch((error) => {
        if (error.response) {
          return error.response.data
        }
      })
  },
  retrieveBackendVersion (store) {
    return axios.get(`${BACKEND_VERSION_PATH}`)
      .then((response) => {
        return response.data.build.version
      })
      .catch((error) => {
        if (error.response) {
          return "Error"
        }
      })
  },
  retrieveAccessCriteriaByResourceId ({ state, commit }, { resourceId }) {
    return axios.get(`${ACCESS_CRITERIA_PATH}`, { headers: getBearerHeaders(state.oidc.access_token), params: { resourceId } })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
        return null
      })
  },
  retrieveCombinedAccessForm ({ state, commit }, { requestId }) {
    return axios.get(`${BASE_API_PATH}/requests/${requestId}/access-form`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
        return null
      })
  },
  async createNegotiation ({ state, commit }, { data }) {
    data.attachments = []
    for (const [sectionName, criteriaList] of Object.entries(data.payload)) {
      for (const [criteriaName, criteriaValue] of Object.entries(criteriaList)) {
        if (criteriaValue instanceof File) {
          const formData = new FormData()
          formData.append("file", criteriaValue)
          const uploadFileHeaders = { headers: getBearerHeaders(state.oidc.access_token) }

          uploadFileHeaders["Content-type"] = "multipart/form-data"

          const attachmentsIds = await axios.post("/api/v3/attachments", formData, uploadFileHeaders)
            .then((response) => {
              return response.data
            })
            .catch(() => {
              commit("setNotification", "There was an error saving the attachment")
              return null
            })
          data.payload[sectionName][criteriaName] = attachmentsIds
          data.attachments.push(attachmentsIds)
        }
      }
    }
    return axios.post(NEGOTIATION_PATH, data, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data.id
      })
      .catch(() => {
        commit("setNotification", "There was an error saving the Negotiation")
      })
  },
  retrieveNegotiations ({ state, commit }, { filtersSortData, pageNumber }) {
    const parameters = {
      headers: getBearerHeaders(state.oidc.access_token),
      params: { status: filtersSortData.status, createdAfter: filtersSortData.dateStart, createdBefore: filtersSortData.dateEnd, sortBy: filtersSortData.sortBy, sortOrder: filtersSortData.sortDirection, page: pageNumber },
      paramsSerializer: { indexes: null }
    }
    return axios.get(`${BASE_API_PATH}/negotiations`, parameters)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
        return []
      })
  },
  retrieveNegotiationsByUserId ({ state, commit }, { role, filtersSortData, userId, pageNumber }) {
    const parameters = {
      headers: getBearerHeaders(state.oidc.access_token),
      params: { role, status: filtersSortData.status, createdAfter: filtersSortData.dateStart, createdBefore: filtersSortData.dateEnd, sortBy: filtersSortData.sortBy, sortOrder: filtersSortData.sortDirection, page: pageNumber },
      paramsSerializer: { indexes: null }
    }
    return axios.get(`${BASE_API_PATH}/users/${userId}/negotiations`, parameters)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
        return []
      })
  },
  updateNegotiationStatus ({ state, commit }, { negotiationId, event }) {
    return axios.put(`${NEGOTIATION_PATH}/${negotiationId}/lifecycle/${event}`, {}, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        commit("setNotification", `Negotiation updated correctly with data ${response.data.id}`)
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error updating negotiation status")
        return null
      })
  },
  async retrievePossibleEvents ({ state, commit }, { negotiationId }) {
    return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/lifecycle`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  retrievePossibleEventsForResource ({ state, commit }, { negotiationId, resourceId }) {
    return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/resources/${resourceId}/lifecycle`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  updateResourceStatus ({ state, commit }, { negotiationId, resourceId, event }) {
    return axios.put(`${NEGOTIATION_PATH}/${negotiationId}/resources/${resourceId}/lifecycle/${event}`, {}, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        commit("setNotification", `Negotiation updated correctly with data ${response.data.id}`)
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error updating negotiation status")
        return null
      })
  },
  async retrieveNegotiationById ({ state, commit }, { negotiationId }) {
    return axios.get(`${NEGOTIATION_PATH}/${negotiationId}`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  async retrievePostsByNegotiationId ({ state, commit }, { negotiationId, resourceId }) {
    const url = `${NEGOTIATION_PATH}/${negotiationId}/posts`
    const params = resourceId ? { resource: resourceId } : { }
    return axios.get(url, { headers: getBearerHeaders(state.oidc.access_token), params })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  async retrieveAttachmentsByNegotiationId ({ state, commit }, { negotiationId }) {
    const url = `${NEGOTIATION_PATH}/${negotiationId}/attachments`
    return axios.get(url, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  addMessageToNegotiation ({ state, commit }, { data }) {
    return axios.post(`${NEGOTIATION_PATH}/${data.negotiationId}/posts`, data, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error sending message")
      })
  },
  addAttachmentToNegotiation ({ state, commit }, { data }) {
    const formData = new FormData()
    const uploadFileHeaders = { headers: getBearerHeaders(state.oidc.access_token) }
    if (data.organizationId != null) {
      formData.append("organizationId", data.organizationId)
    }
    formData.append("file", data.attachment)
    uploadFileHeaders["Content-type"] = "multipart/form-data"

    return axios.post(`${NEGOTIATION_PATH}/${data.negotiationId}/attachments`, formData, uploadFileHeaders)
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "There was an error saving the attachment")
        return null
      })
  },
  markMessageAsRead ({ state }, { data }) {
    return axios.put(`${NEGOTIATION_PATH}/${data.negotiationId}/posts/${data.postId}`, data, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data.id
      })
      .catch(() => {
        return "Failed"
      })
  },
  getUnreadMessagesByRole ({ state }, { data }) {
    // the role shoud be complementary in relation of the one from the user
    const complementaryRole = data.Rolename === ROLES.RESEARCHER ? ROLES.REPRESENTATIVE : ROLES.RESEARCHER
    return axios.get(`${NEGOTIATION_PATH}/${data.negotiationId}/${complementaryRole}/posts`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return "Failed"
      })
  },
  retrieveUser ({ state, commit }) {
    return axios.get(USER_PATH, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data._embedded
      })
      .catch(() => {
        commit("setNotification", "Error sending message")
      })
  },
  retrieveUserRoles ({ state, commit }) {
    return axios.get(USER_ROLES_PATH, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error sending message")
      })
  },
  retrieveUserRepresentedResources ({ state, commit }) {
    return axios.get(USER_RESOURCES_PATH, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error sending message")
      })
  },
  downloadAttachment ({ state }, { id, name }) {
    axios.get(`${ATTACHMENTS_PATH}/${id}`, { headers: getBearerHeaders(state.oidc.access_token), responseType: "blob" })
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
  },
  setSavedNegotiationsView ({ state, commit }, { negotiationsView }) {
    commit("setSavedNegotiationsView", negotiationsView)
  }
}
