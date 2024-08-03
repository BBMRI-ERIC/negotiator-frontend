const devSettings = {
  faqPage: true,
  vueTour: true,
  notifications: true,
  voteNegotiation: true
}

const prodSettings = {
  faqPage: "FEATURE_FLAG_FAQPAGE_PLACEHOLDER",
  vueTour: "FEATURE_FLAG_VUETOUR_PLACEHOLDER",
  notifications: "FEATURE_FLAG_NOTIFICATIONS",
  voteNegotiation: "FEATURE_FLAG_VOTENEGOTIATION"
}

let allFeatureFlags

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
