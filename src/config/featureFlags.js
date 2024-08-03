const devSettings = {
  faqPage: true,
  vueTour: true,
  notifications: true
}

const prodSettings = {
  faqPage: "FEATURE_FLAG_FAQPAGE_PLACEHOLDER",
  vueTour: "FEATURE_FLAG_VUETOUR_PLACEHOLDER",
  notifications: "FEATURE_FLAG_NOTIFICATIONS"
}

let allFeatureFlags

function getSearchParameters () {
  const prmstr = window.location.search.substr(1)
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {}
}

function transformToAssocArray (prmstr) {
  const params = {}
  const prmarr = prmstr.split("&")
  for (let i = 0; i < prmarr.length; i++) {
    const tmparr = prmarr[i].split("=")
    params[tmparr[0]] = tmparr[1]
  }
  return params
}

const params = getSearchParameters()

function setFeatureFlagsFromParams () {
  for (const key in params) {
    if (devSettings[key] || prodSettings[key]) {
      if (import.meta.env.DEV) {
        devSettings[key] = params[key]
      } else {
        prodSettings[key] = params[key]
      }
    }
  }
}

setFeatureFlagsFromParams()

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
