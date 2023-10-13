import { ROLES } from "@/config/consts"
import axios from "axios"

let BASE_API_PATH = "/api/v3"
const ACCESS_CRITERIA_PATH = `${BASE_API_PATH}/access-criteria/`
const REQUESTS_PATH = `${BASE_API_PATH}/requests`
const NEGOTIATION_PATH = `${BASE_API_PATH}/negotiations`
const USER_PATH = `${BASE_API_PATH}/users/roles`
const ATTACHMENTS_PATH = `${BASE_API_PATH}/attachments`

function getBearerHeaders(token) {
  return { Authorization: `Bearer ${token}` }
}


export default {
  retrieveRequestById(store, { requestId }) {
    return axios.get(`${REQUESTS_PATH}/${requestId}`)
      .then((response) => {
        // it handles the error when backend is unreachable but vite proxy strangely return 200
        if (response.data == "") {
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
  retrieveAccessCriteriaByResourceId({ state, commit }, { resourceId }) {
    return axios.get(`${ACCESS_CRITERIA_PATH}`, { headers: getBearerHeaders(state.oidc.access_token), params: { resourceId: resourceId } })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
        return null
      })

  },
  async createNegotiation({ state, commit }, { data }) {
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
  retrieveNegotiationsByRole({ state, commit }, { userRole }) {
    return axios.get(`${NEGOTIATION_PATH}`, { headers: getBearerHeaders(state.oidc.access_token), params: { userRole: userRole } })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
        return []
      })
  },
  updateNegotiationStatus({ state, commit }, { negotiationId , event }) {
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
  retrievePossibleEvents({ state, commit }, { negotiationId }) {
    return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/lifecycle`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  retrievePossibleEventsForResource({ state, commit }, { negotiationId, resourceId }) {
    return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/resources/${resourceId}/lifecycle`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  updateResourceStatus({ state, commit }, { negotiationId , resourceId, event }) {
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
  async retrieveNegotiationById({ state, commit }, { negotiationId }) {
    return axios.get(`${NEGOTIATION_PATH}/${negotiationId}`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  retrievePostsByNegotiationId({ state, commit }, { negotiationId, resourceId }) {
    let url = `${NEGOTIATION_PATH}/${negotiationId}/posts`
    let params = resourceId ? { resource: resourceId } : { }
    return axios.get(url, { headers: getBearerHeaders(state.oidc.access_token), params: params })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error getting request data from server")
      })
  },
  addMessageToNegotiation({ state, commit }, { data }) {
    console.log(data)
    return axios.post(`${NEGOTIATION_PATH}/${data.negotiationId}/posts`, data, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error sending message")
      })
  },
  markMessageAsRead({ state }, { data }) {
    return axios.put(`${NEGOTIATION_PATH}/${data.negotiationId}/posts/${data.postId}`, data, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data.id
      })
      .catch(() => {
        return "Failed"
      })
  },
  getUnreadMessagesByRole({ state }, { data }) {
    //the role shoud be complementary in relation of the one from the user 
    let complementaryRole = data.Rolename == ROLES.RESEARCHER ? ROLES.REPRESENTATIVE : ROLES.RESEARCHER
    return axios.get(`${NEGOTIATION_PATH}/${data.negotiationId}/${complementaryRole}/posts`, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        return "Failed"
      })
  },
  retrieveUserRoles({ state, commit }) {
    return axios.get(USER_PATH, { headers: getBearerHeaders(state.oidc.access_token) })
      .then((response) => {
        return response.data
      })
      .catch(() => {
        commit("setNotification", "Error sending message")      
      })
  },
  downloadAttachment({ state }, { id, name }) {
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
  }
}