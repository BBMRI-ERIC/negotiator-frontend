export default {
  setNotification (state, notificationMessage) {
    state.notification = notificationMessage
    if (notificationMessage) {
      state.allNotifications.push(notificationMessage)
    }
  },
  setNegotiations (state, negotiations) {
    state.negotiations = negotiations
  },
  setSavedNegotiationsView (state, negotiationsView) {
    state.savedNegotiationsView = negotiationsView
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  }
}
