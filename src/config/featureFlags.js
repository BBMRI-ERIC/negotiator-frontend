const devSettings = {
  faqPage: true,
  vueTour: true,
  notifications: true,
  networks: true,
  LSLoginDownWarning: true,
  LSLoginDownWarningText: "⚠ We're sorry, but we're having some technical difficulties. Please try again later."
}

const prodSettings = {
  faqPage: "FEATURE_FLAG_FAQPAGE_PLACEHOLDER",
  vueTour: "FEATURE_FLAG_VUETOUR_PLACEHOLDER",
  notifications: "FEATURE_FLAG_NOTIFICATIONS",
  networks: "FEATURE_FLAG_NETWORKS",
  LSLoginDownWarning: "FEATURE_FLAG_LS_LOGIN_DOWN_WARNING_PLACEHOLDER",
  LSLoginDownWarningText: "FEATURE_FLAG_LS_LOGIN_DOWN_WARNING_TEXT_PLACEHOLDER"
}

let allFeatureFlags

if (import.meta.env.DEV) {
  allFeatureFlags = devSettings
} else {
  allFeatureFlags = prodSettings
}

export default allFeatureFlags
