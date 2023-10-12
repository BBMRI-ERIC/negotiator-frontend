const devSettings = {
  authority: "http://localhost:4011/",
  clientId: "client-credentials-mock-client",
  clientSecret: "authorization-code-with-pkce-client-secret",
  redirectUri: "http://localhost:8080/logged-in",
  postLogoutRedirectUri: "http://localhost:8080",
  responseType: "code",
  scope: "openid profile email permissions",
  automaticSilentRenew: true
}

const prodSettings = {
  authority: "AUTH_URL_PLACEHOLDER",
  clientId: "CLIENT_ID_PLACEHOLDER",
  redirectUri: "REDIRECT_URI_PLACEHOLDER",
  postLogoutRedirectUri: "LOGOUT_URI_PLACEHOLDER",
  responseType: "code",
  scope: "openid profile email offline_access eduperson_entitlement",
  automaticSilentRenew: true
}

let oidcSettings

if (import.meta.env.DEV) {
  oidcSettings = devSettings
}
else {
  oidcSettings = prodSettings
}

export default oidcSettings