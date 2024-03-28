export default {
  setNotification (state, notificationMessage) {
    state.notification = notificationMessage
  },
  setNegotiations (state, negotiations) {
    state.negotiations = negotiations
  },
  setSavedNegotiationsView (state, negotiationsView) {
    state.savedNegotiationsView = negotiationsView
  },
  setServerURL (state, url) {
    state.serverUrl = url
  }
}
