import state from "../store/state.js"

const BASE_API_PATH = "/api/v3"

const apiPaths = {
  BASE_API_PATH: `${BASE_API_PATH}`,
  ACCESS_CRITERIA_PATH: `${BASE_API_PATH}/access-criteria`,
  REQUESTS_PATH: `${BASE_API_PATH}/requests`,
  NEGOTIATION_PATH: `${BASE_API_PATH}/negotiations`,
  USER_PATH: `${BASE_API_PATH}/userinfo`,
  USER_RESOURCES_PATH: `${BASE_API_PATH}/users/resources`,
  ATTACHMENTS_PATH: `${BASE_API_PATH}/attachments`,
  BACKEND_ACTUATOR_INFO_PATH: "/api/actuator/info",
  VALUE_SETS: `${BASE_API_PATH}/value-sets`
}

function getBearerHeaders () {
  return { Authorization: `Bearer ${state.oidc.access_token}` }
}

export { apiPaths, getBearerHeaders }
