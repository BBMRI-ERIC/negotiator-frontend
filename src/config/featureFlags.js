const devSettings = {
  faqPage: true,
  vueTour: false,
  notifications: true
}

const prodSettings = {
  faqPage: "FEATURE_FLAG_FAQPAGE_PLACEHOLDER",
  vueTour: "FEATURE_FLAG_VUETOUR_PLACEHOLDER",
  notifications: "FEATURE_FLAG_NOTIFICATIONS"
}

let allFeatureFlags

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
