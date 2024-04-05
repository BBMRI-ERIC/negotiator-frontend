const devSettings = {
  directory: "https://directory.bbmri-eric.eu"
}

const prodSettings = {
  directory: "EXTERNAL_LINK_DIRECTORY_PLACEHOLDER"
}

let allExternalLinks

if (import.meta.env.DEV) {
  allExternalLinks = devSettings
} else {
  allExternalLinks = prodSettings
}

export default allExternalLinks
