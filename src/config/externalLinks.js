const devSettings = { 
    directory: "https://directory.bbmri-eric.eu",
}

const prodSettings = {
    directory: "https://directory.bbmri-eric.eu",
}

let allExternalLinks

if (import.meta.env.DEV) {
    allExternalLinks = devSettings
}
else {
    allExternalLinks = prodSettings
}

export default allExternalLinks