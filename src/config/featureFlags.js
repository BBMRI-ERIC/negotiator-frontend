const devSettings = {
  faqPage: false,
  vueTour: false
}

const prodSettings = {
  faqPage: false,
  vueTour: false
}

let allFeatureFlags

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
