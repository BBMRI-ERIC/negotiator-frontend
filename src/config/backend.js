const devSettings = {
  basePaths: ["http://localhost:8081/api/v3", "http://localhost:8082/api/v3"]
}
const prodSettings = {
  basePaths: ["http://localhost:8081", "http://localhost:8082"]
}
let backendSettings

if (import.meta.env.DEV) {
  backendSettings = devSettings
} else {
  backendSettings = prodSettings
}

export default backendSettings
