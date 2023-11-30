<template>
  <div>
    <span class="fs-5 fw-bold text-secondary mt-3">
      <i class="bi bi-card-list" />
      RESOURCES ({{ numberOfResources }})
    </span>
    <div>
      <div
        v-for="[orgId, org] in Object.entries(organizationsById)"
        :key="orgId"
        class="card my-2"
      >
        <div
          class="card-header cursor-pointer text-primary fw-bold"
          data-bs-toggle="collapse"
          :data-bs-target="`#card-body-block-${getElementIdFromResourceId(orgId)}`"
          aria-expanded="true"
          :aria-controls="`card-body-block-${getElementIdFromResourceId(orgId)}`"
        >
          {{ `${org.name} (${org.resources.length})` }}  
        </div>
        <div
          :id="`card-body-block-${getElementIdFromResourceId(orgId)}`"
          class="collapse show"
        >
          <div    
            v-for="resource in org.resources"
            :key="resource.id"
            class="card-body"
          >
            <span
              class="text-dark"
              :for="getElementIdFromResourceId(resource.id)"
            >
              {{ resource.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResourcesList",
  props: {
    resources: {
      type: Array[Object],
      default: []
    }
  },
  computed: {
    organizations() {
      return Object.entries(this.organizationsById).map(([k, v]) => { return { externalId: k, name: v.name }})
    },
    organizationsById() {        
      return this.resources.reduce((organizations, resource) => {
        if (resource.organization.externalId in organizations) {
          organizations[resource.organization.externalId].resources.push(
            resource)
        } else {
          organizations[resource.organization.externalId] = {
            name: resource.organization.name,
            resources: [resource] 
          }
        }
        return organizations
      }, {})
    },
    resourcesById() {
      return this.resources.reduce((resourcesObjects, resource) => {
        resourcesObjects[resource.id] = resource
        return resourcesObjects
      }, {})
    },
    numberOfResources() {
      return this.resources.length
    },
  },
  methods: {
    getElementIdFromResourceId(resourceId) {
      return resourceId.replaceAll(":", "_")
    },
  },
}
</script>