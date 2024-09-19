const devSettings = {
  authority: "http://localhost:4011",
  client_id: "client-credentials-mock-client",
  client_secret: "authorization-code-with-pkce-client-secret",
  resource: "https://negotiator.bbmri-eric.eu",
  redirect_uri: "http://localhost:8080/logged-in",
  scope: "openid profile email permissions some-app-scope-1",
  automaticSilentRenew: true,
  post_logout_redirect_uri: "http://localhost:8080",
  response_type: "code"
}

const prodSettings = {
  authority: "AUTH_URL_PLACEHOLDER",
  client_id: "CLIENT_ID_PLACEHOLDER",
  resource: "RESOURCES_PLACEHOLDER",
  redirect_uri: "REDIRECT_URI_PLACEHOLDER",
  scope: "openid profile email offline_access eduperson_entitlement",
  post_logout_redirect_uri: "LOGOUT_URI_PLACEHOLDER",
  response_type: "code",
  automaticSilentRenew: true
}

let oidcSettings

if (import.meta.env.DEV) {
  oidcSettings = devSettings
} else {
  oidcSettings = prodSettings
}

export default oidcSettings
