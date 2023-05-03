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
    retrieveResearcherRoleNegotiations({ state, commit }) {
        axios.get(`${NEGOTIATION_PATH}/?userRole=RESEARCHER`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
            commit('setNegotiations', response.data)
        })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    },
    retrieveBiobankerRoleNegotiations({ state, commit }) {
        axios.get(`${NEGOTIATION_PATH}/?userRole=BIOBANKER`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
            commit('setNegotiations', response.data)
        })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    },
    updateNegotiationStatus({ state, commit }, { negotiationId , event }) {
        console.log(state.oidc.access_token)
        axios.put(`${NEGOTIATION_PATH}/${negotiationId}/${event}`,{"a": "idk"}, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                commit('setNotification', `Negotiation updated correctly with data ${response.data.id}`)
            })
    },
    retrievePossibleEvents({ state, commit }, {negotiationId}) {
        return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/events`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    }
}