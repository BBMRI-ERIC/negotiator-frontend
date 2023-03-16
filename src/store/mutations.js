export default {
    setCurrentAccessCriteria (state, accessCriteria) {
        state.accessCriteria = accessCriteria
    },
    setCurrentRequest(state, request) {
        state.request = request
    },
    setNotification(state, notificationMessage) {
        state.notification = notificationMessage
    }
}