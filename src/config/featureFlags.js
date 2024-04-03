const devSettings = {
  faqPage: true,
  vueTour: false
}

const prodSettings = {
  faqPage: Boolean("FEATURE_FLAG_FAQPAGE_PLACEHOLDER"),
  vueTour: Boolean("FEATURE_FLAG_VUETOUR_PLACEHOLDER")
}

let allFeatureFlags

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
