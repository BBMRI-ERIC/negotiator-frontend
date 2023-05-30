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
    retrieveRequestById(store, { requestId }) {
        return axios.get(`${REQUESTS_PATH}/${requestId}`)
            .then((response) => {
                // it handles the error when backend is unreachable but vite proxy strangely return 200
                if (response.data == "") {
                    return {
                        code: 500
                    }
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
        return axios.get(`${ACCESS_CRITERIA_PATH}?resourceId=${resourceId}`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data;
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
                return null
            })

    },
    createNegotiation({ state }, { data }) {
        return axios.post(NEGOTIATION_PATH, data, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data.id
            })
            .catch(() => {
                return null
            })
    },
    retrieveNegotiationsByRole({ state, commit }, { role }) {
        return axios.get(`${NEGOTIATION_PATH}/?userRole=${role}`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data;
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
                return []
            })
    },
    updateNegotiationStatus({ state, commit }, { negotiationId , event }) {
        return axios.put(`${NEGOTIATION_PATH}/${negotiationId}/lifecycle/${event}`, {}, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                commit('setNotification', `Negotiation updated correctly with data ${response.data.id}`)
                return response.data
            })
            .catch(() => {
                commit('setNotification', 'Error updating negotiation status')
                return null
            })
    },
    retrievePossibleEvents({ state, commit }, { negotiationId }) {
        return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/lifecycle`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    }, 
    retrieveNegotiationById({ state, commit }, { negotiationId }) {
        console.log('retrieving...')
        console.log(negotiationId)
        return axios.get(`${NEGOTIATION_PATH}/${negotiationId}`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    },
    retrievePostsByNegotiationId({ state, commit }, { negotiationId }) {
        console.log('retrieving...')
        console.log(negotiationId)
        return axios.get(`${NEGOTIATION_PATH}/${negotiationId}/posts`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data
            })
            .catch(() => {
                commit('setNotification', 'Error getting request data from server')
            })
    },
    addMessageToNegotiation({ state }, { data }) {
        console.log('adding message')
        console.log(data)
        return axios.post(`${NEGOTIATION_PATH}/${data.negotiationId}/posts`, data, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                console.log('*************')
                console.log(response)
                return response.data.id
            })
            .catch(() => {
                return "Failed"
            })
    },

    markMessageAsRead({ state }, { data }) {
        console.log('adding message')
        console.log(data)
        return axios.put(`${NEGOTIATION_PATH}/${data.negotiationId}/posts/${data.postId}`, data, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                console.log('*************')
                console.log(response)
                return response.data.id
            })
            .catch(() => {
                return "Failed"
            })
    },
    getUnreadMessagesByRole({ state }, { data }) {
        //the role shoud be complementary in relation of the one from the user 
        let complementaryRole = data.Rolename == 'RESEARCHER' ? 'BIOBANKER' : 'RESEARCHER'
        return axios.get(`${NEGOTIATION_PATH}/${data.negotiationId}/${complementaryRole}/posts`, getBearerHeaders(state.oidc.access_token))
            .then((response) => {
                return response.data
            })
            .catch(() => {
                return "Failed"
            })
    },
}