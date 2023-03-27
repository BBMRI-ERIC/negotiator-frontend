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
    retrieveRequestById({ commit }, { token, requestId }) {
        axios.get(`${REQUESTS_PATH}/${requestId}`, getBearerHeaders(token))
            .then((response) => commit('setCurrentRequest', response.data))
    },
    retrieveAccessCriteria({ commit }, { token, resourceId }) {
        axios.get(`${ACCESS_CRITERIA_PATH}?resourceId=${resourceId}`, getBearerHeaders(token))
            .then((response) => {
                commit('setCurrentAccessCriteria', response.data)
            })
            .catch((error) => {
                console.log(`Error retrieving access criteria: ${error}`)
            })
    },
    retrieveAccessCriteriaByRequestId({ commit }, { token, requestId }) {
        axios.get(`${REQUESTS_PATH}/${requestId}`, getBearerHeaders(token))
            .then((response) => {
                const resourceId = response.data.resources[0].id  // At the moment we only get criteria for the first biobank
                axios.get(`${ACCESS_CRITERIA_PATH}?resourceId=${resourceId}`, getBearerHeaders(token))
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
    createNegotiation({ commit }, { data, token }) {
        data = {
            "title": data.title,
            "description": data.description,
            "project": {
                "title": "Project of request #2",
                "description": "Great",
                "ethicsVote": data.ethicsVote,
                "expectedDataGeneration": true,
                "expectedEndDate": "2022-11-10",
                "isTestProject": false
            },
            "queries": data.queries
        }
        axios.post(NEGOTIATION_PATH, data, getBearerHeaders(token))
            .then((response) => {
                console.log(`Negotiation created correctly with data ${response.data.id}`)
                commit('setNotification', `Negotiation created correctly with data ${response.data.id}`)
            })
    }
}