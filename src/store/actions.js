import axios from 'axios'

let BASE_API_PATH = '/api/v3'
const ACCESS_CRITERIA_PATH = `${BASE_API_PATH}/access-criteria/`
const REQUESTS_PATH = `${BASE_API_PATH}/requests`
const NEGOTIATION_PATH = `${BASE_API_PATH}/negotiations`
function getBearerHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
}


export default {
    retrieveRequestById({ state, commit }, { requestId }) {
        axios.get(`${REQUESTS_PATH}/${requestId}`, getBearerHeaders(state.oidc.access_token))
            .then((response) => commit('setCurrentRequest', response.data))
    },
    retrieveAccessCriteria({ state, commit }, { resourceId }) {
        axios.get(`${ACCESS_CRITERIA_PATH}?resourceId=${resourceId}`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                commit('setCurrentAccessCriteria', response.data)
            })
            .catch((error) => {
                console.log(`Error retrieving access criteria: ${error}`)
            })
    },
    retrieveAccessCriteriaByRequestId({ state, commit }, { requestId }) {
        axios.get(`${REQUESTS_PATH}/${requestId}`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                const resourceId = response.data.resources[0].id  // At the moment we only get criteria for the first biobank
                axios.get(`${ACCESS_CRITERIA_PATH}?resourceId=${resourceId}`, getBearerHeaders(state.oidc.access_token))
                    .then((response) => {
                        commit('setCurrentAccessCriteria', response.data)
                    })
                    .catch(() => {
                        commit('setNotification', 'Error getting request data from server')
                    })
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    },
    createNegotiation({ state, commit }, { data }) {
        axios.post(NEGOTIATION_PATH, data, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                commit('setNotification', `Negotiation created correctly with data ${response.data.id}`)
            })
    },
    retrieveNegotiations({commit}, {token}) {
        axios.get(NEGOTIATION_PATH, getBearerHeaders(token)).then((response) => {
            commit('setNegotiations', response.data)
        })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    }
}