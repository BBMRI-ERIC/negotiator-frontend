// hasUser middleware
// call retrieveUser only once because otherwise we get an error on backend
export default async function hasUser ({ next, userStore }) {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser().then(() => {
      return next()
    })
  }

  // if (Object.keys(store.getters.getUserInfo).length === 0) {
  //   await store.dispatch("retrieveUser").then(() => {
  //     return next()
  //   })
  // }
  return next()
}
