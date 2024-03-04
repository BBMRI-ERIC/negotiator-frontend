const devSettings = {
  faqPage: false
}

const prodSettings = {
  faqPage: false
}

let allFeatureFlags

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
