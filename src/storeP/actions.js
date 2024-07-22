import { ROLES } from "@/config/consts"
import axios from "axios"

const BASE_API_PATH = "/api/v3"
const ACCESS_CRITERIA_PATH = `${BASE_API_PATH}/access-criteria`
const REQUESTS_PATH = `${BASE_API_PATH}/requests`
const NEGOTIATION_PATH = `${BASE_API_PATH}/negotiations`
const USER_PATH = `${BASE_API_PATH}/userinfo`
const USER_RESOURCES_PATH = `${BASE_API_PATH}/users/resources`
const ATTACHMENTS_PATH = `${BASE_API_PATH}/attachments`
const BACKEND_ACTUATOR_INFO_PATH = "/api/actuator/info"
const VALUE_SETS = `${BASE_API_PATH}/value-sets`

export default {

  // markMessageAsRead ({ state }, { data }) {
  //   return axios.put(`${NEGOTIATION_PATH}/${data.negotiationId}/posts/${data.postId}`, data, { headers: getBearerHeaders(state.oidc.access_token) })
  //     .then((response) => {
  //       return response.data.id
  //     })
  //     .catch(() => {
  //       return "Failed"
  //     })
  // },
  // getUnreadMessagesByRole ({ state }, { data }) {
  //   // the role shoud be complementary in relation of the one from the user
  //   const complementaryRole = data.Rolename === ROLES.RESEARCHER ? ROLES.REPRESENTATIVE : ROLES.RESEARCHER
  //   return axios.get(`${NEGOTIATION_PATH}/${data.negotiationId}/${complementaryRole}/posts`, { headers: getBearerHeaders(state.oidc.access_token) })
  //     .then((response) => {
  //       return response.data
  //     })
  //     .catch(() => {
  //       return "Failed"
  //     })
  // },

}
