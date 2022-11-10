export default {
    retrieveAccessCriteria({ commit }) {
        const accessCriteria = {
            "accessCriteria": [
                {
                    "name": "description",
                    "description": "Give a description",
                    "type": "text",
                    "required": true
                },
                {
                    "name": "title",
                    "description": "Give a title",
                    "type": "text",
                    "required": true
                }
            ]
        }
        commit('setCurrentAccessCriteria', accessCriteria)
    }
}