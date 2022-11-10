import axios from 'axios'

const BASE_API_PATH = '/api/v3'

const ACCESS_CRITERIA_PATH = `${BASE_API_PATH}/access-criteria`

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
    }
}