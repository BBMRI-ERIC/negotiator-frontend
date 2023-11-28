<template>
  <div>
    <p 
      v-if="collapsible"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#resourcesList"
      aria-expanded="false"
      aria-controls="resourcesList"
    >
      <span class="fs-5 fw-bold text-secondary mt-3">
        <i class="bi bi-card-list" />
        RESOURCES ({{ numberOfResources }})
      </span>
    </p>
    <span
      v-else
      class="fs-5 fw-bold text-secondary mt-3"
    >
      <i class="bi bi-card-list" />
      RESOURCES ({{ numberOfResources }})
    </span>
    <div
      v-for="[orgId, org] in Object.entries(organizationsById)"
      id="resourcesList"
      :key="orgId"
      class="card my-2"
    >
      <div
        class="card-header cursor-pointer"
        data-bs-toggle="collapse"
        :data-bs-target="`#card-body-block-${getElementIdFromResourceId(orgId)}`"
        aria-expanded="true"
        :aria-controls="`card-body-block-${getElementIdFromResourceId(orgId)}`"
      >
        <button
          class="btn btn-link text-primary fw-bold"
          style="text-decoration: none;"
          type="button"
        >
          {{ `${org.name} (${org.resources.length})` }}  
        </button>
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
          <div class="form-check">
            <label
              class="form-check-label"
              :for="getElementIdFromResourceId(resource.id)"
            >
              {{ resource.name }}
            </label>
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
    },
    changeStatusAvailable: {
      type: Boolean,
      default: false
    },
    collapsible: {
      type: Boolean,
      default: false
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
    getElementIdFromResourceId(collection) {
      return collection.replaceAll(":", "_")
    },
  },
}
</script>