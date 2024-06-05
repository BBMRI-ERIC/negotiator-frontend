// hasUser middleware
// call retrieveUser only once because otherwise we get an error on backend
export default async function hasUser ({ next, store }) {
  if (Object.keys(store.getters.getUserInfo).length === 0) {
    await store.dispatch("retrieveUser").then(() => {
      return next()
    })
  }
  return next()
}
