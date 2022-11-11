import axios from 'axios'

const BASE_API_PATH = '/api/v3'

const ACCESS_CRITERIA_PATH = `${BASE_API_PATH}/access-criteria`
const NEGOTIATION_PATH = `${BASE_API_PATH}/negotiations`

const auth = {
    username: 'researcher',
    password: 'researcher'
}

export default {
    retrieveAccessCriteria({ commit }) {
        axios.get(`${ACCESS_CRITERIA_PATH}?resourceId=biobank:1`, { auth })
            .then((response) => {
                commit('setCurrentAccessCriteria', response.data.accessCriteria)
            })
            .catch((error) => {
                console.log(`Error retrieving access criteria: ${error}`)
            })
    },
    createNegotiation(store, data) {
        data = {
            "title": "Test Request #2 with project included",
            "description": "Need some samples for a very important study on a disease",
            "project": {
                "title": "Project of request #2",
                "description": "Great",
                "ethicsVote": "Ethics vote",
                "expectedDataGeneration": true,
                "expectedEndDate": "2022-11-10",
                "isTestProject": false
            },
            "queries": ["27207e53-e975-453a-9ee1-419526365eec"]
        }
        axios.post(NEGOTIATION_PATH, data, { auth })
            .then((response) => {
                console.log(`${response} created correctly`)
            })
    }
}