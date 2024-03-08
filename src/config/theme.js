const devSettings = {
  activeThemeFile: "bbmri",
  activeLogosFiles: "bbmri",
  isFooterFollowUsVisible: true
}

const prodSettings = {
  activeThemeFile: "ACTIVE_THEME_PLACEHOLDER",
  activeLogosFiles: "ACTIVE_LOGOS_PLACEHOLDER",
  isFooterFollowUsVisible: "FOLLOW_US_VISIBLE_PLACEHOLDER"
}

let activeTheme

if (import.meta.env.DEV) {
  activeTheme = devSettings
} else {
  activeTheme = prodSettings
}

export default activeTheme
