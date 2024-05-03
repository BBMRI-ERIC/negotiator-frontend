<template>
  <div
    v-if="!loading"
  >
    <button
      type="button"
      class="btn btn-primary"
      @click="
        $router.go(-1)
      "
    >
      <i class="bi-arrow-left" />
      Go back
    </button>
    <confirmation-modal
      id="abandonModal"
      title="Are you sure you want to abandon this Negotiation?"
      text="Confirming, you will not be able to access this negotiation again."
      @confirm="updateNegotiation('ABANDON')"
    />
    <div class="row mt-4">
      <div class="row-col-2">
        <h1 class="text-primary fw-bold">
          {{ negotiation ? negotiation.payload.project.title?.toUpperCase() : "" }}
        </h1>
        <span
          :class="getBadgeColor(negotiation.status)"
          class="badge py-2 rounded-pill"
        ><i
          :class="getBadgeIcon(negotiation.status)"
          class="px-1"
        /> {{ negotiation ? transformStatus(negotiation.status) : "" }}</span>
        <hr>
      </div>
      <div class="col-8">
        <ul class="list-group list-group-flush rounded border px-3 my-3">
          <li
            v-for="(element, key) in negotiation.payload"
            :key="element"
            class="list-group-item p-3"
          >
            <span class="fs-5 fw-bold text-primary-text mt-3">
              {{ key.toUpperCase() }}</span>
            <div
              v-for="(subelement, subelementkey) in element"
              :key="subelement"
              class="mt-3"
            >
              <label
                class="me-2 fw-bold text-secondary-text"
              >{{ subelementkey.toUpperCase() }}:</label>
              <span
                v-if="isAttachment(subelement)"
                class="text-secondary-text"
              >
                {{ subelement.name }}
                <font-awesome-icon
                  v-if="isAttachment(subelement)"
                  class="ms-1 cursor-pointer"
                  icon="fa fa-download"
                  fixed-width
                  @click.prevent="downloadAttachment({id: subelement.id, name: subelement.name})"
                />
              </span>
              <span
                v-else
                class="text-secondary-text text-break"
              >
                {{ subelement }}
              </span>
            </div>
          </li>
          <li class="list-group-item p-3">
            <span class="fs-5 fw-bold text-primary-text mt-3 mb-3">
              ATTACHMENTS
            </span>
            <NegotiationAttachment
              v-for="attachment in attachments"
              :id="attachment.id"
              :key="attachment.id"
              class="mb-2"
              :name="attachment.name"
              :size="attachment.size"
              :content-type="attachment.contentType"
              @download="downloadAttachment({id: attachment.id, name: attachment.name})"
            />
          </li>
          <li class="list-group-item p-3">
            <div
              class="d-flex flex-row mb-3 justify-content-between"
              style="min-height: 38px;"
            >
              <div
                data-bs-toggle="collapse"
                data-bs-target="#resourcesList"
                aria-controls="resourcesList"
                aria-expanded="true"
                type="button"
              >
                <span class="fs-5 fw-bold text-primary-text mt-3">
                  <i class="bi bi-card-list" />
                  COLLECTIONS ({{ numberOfResources }})
                </span>
              </div>
              <div
                data-bs-toggle="collapse"
                data-bs-target="#resourcesList"
                aria-controls="resourcesList"
                aria-expanded="true"
                type="button"
                class="collections-header justify-content-end pt-1"
              >
                <i class="bi bi-chevron-down" />
                <i class="bi bi-chevron-up" />
              </div>
              <div
                v-if="currentMultipleResourceStatus !== undefined && currentResourceEvents.length > 0"
                id="statusChange"
                class="ms-auto d-flex w-50"
              >
                <select
                  v-model="selectedStatus"
                  class="form-select me-2"
                  :disabled="isStatusComboDisabled()"
                >
                  <option selected>
                    Select new state...
                  </option>
                  <option
                    v-for="key in currentResourceEvents"
                    :key="key"
                    :value="key"
                  >
                    {{ transformStatus(key) }}
                  </option>
                </select>
                <button
                  class="btn btn-secondary me-md-2 float-end"
                  type="submit"
                  @click.prevent="updateCheckedResourcesStatus(selectedStatus)"
                >
                  Save
                </button>
              </div>
            </div>
            <div
              v-if="currentMultipleResourceStatus !== undefined && currentResourceEvents.length === 0"
              class="alert alert-danger"
              role="alert"
            >
              No selectable status for this resource(s), wait for the other part to respond
            </div>
            <div
              id="resourcesList"
              class="collapse show"
            >
              <div
                v-for="[orgId, org] in Object.entries(organizationsById)"
                :key="orgId"
                class="card mb-2"
              >
                <div
                  class="card-header cursor-pointer"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#card-body-block-${getElementIdFromResourceId(orgId)}`"
                  :aria-controls="`card-body-block-${getElementIdFromResourceId(orgId)}`"
                >
                  <div class="form-check d-flex justify-content-between cursor-pointer">
                    <div>
                      <input
                        v-if="userRole === availableRoles.RESEARCHER || (userRole === availableRoles.REPRESENTATIVE && isRepresentativeForOrganization(orgId) && selection[orgId])"
                        :id="getElementIdFromResourceId(orgId)"
                        v-model="selection[orgId]['checked']"
                        class="form-check-input justify-content-start"
                        type="checkbox"
                        :disabled="isOrganizationButtonDisabled(org.resources)"
                        @change="selectAllOrganizationResource(orgId, $event)"
                      >
                      <label
                        class="text-primary fw-bold ml-2 cursor-pointer"
                      >
                        {{ org.name }}
                      </label>
                    </div>
                    <div class="justify-content-end pt-1">
                      <i class="bi bi-chevron-down" />
                      <i class="bi bi-chevron-up" />
                    </div>
                  </div>
                </div>
                <div
                  :id="`card-body-block-${getElementIdFromResourceId(orgId)}`"
                  class="collapse multi-collapse"
                >
                  <div
                    v-for="resource in org.resources"
                    :key="resource.id"
                    class="card-body"
                  >
                    <div class="form-check">
                      <input
                        v-if="userRole === availableRoles.RESEARCHER ||
                          (userRole === availableRoles.REPRESENTATIVE && isRepresentativeForOrganization(orgId)) && selection[resource.id]"
                        :id="getElementIdFromResourceId(resource.id)"
                        v-model="selection[resource.id]['checked']"
                        class="form-check-input"
                        type="checkbox"
                        :disabled="isResourceButtonDisabled(resource.id)"
                        @change="setCurrentMultipleStatus(resource.id)"
                      >
                      <label
                        class="form-check-label text-primary-text"
                        :for="getElementIdFromResourceId(resource.id)"
                      >
                        {{ resource.name }}
                      </label>
                      <span class="badge rounded-pill bg-status-badge ms-4">
                        {{ getStatusForResource(resource.id) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <NegotiationPosts
          v-if="negotiation"
          :negotiation="negotiation"
          :user-role="userRole"
          :resources="resources"
          :organizations="organizationsById"
          :recipients="postsRecipients"
        />
      </div>
      <div
        class="col-4"
      >
        <ul class="list-group list-group-flush my-3">
          <li class="list-group-item p-2">
            <div class="fw-bold text-primary-text">
              Author:
            </div>
            <div class="text-secondary-text">
              {{ author.name }}
            </div>
          </li>
          <li class="list-group-item p-2">
            <div class="fw-bold text-primary-text">
              Email:
            </div>
            <span class="text-secondary-text">{{ author.email }}</span>
          </li>
          <li class="list-group-item p-2">
            <div class="fw-bold text-primary-text">
              Negotiation ID:
            </div>
            <span class="text-secondary-text"> {{ negotiation ? negotiation.id : "" }}</span>
          </li>
          <li class="list-group-item p-2">
            <div class="fw-bold text-primary-text">
              Submitted at:
            </div>
            <span class="text-secondary-text"> {{ negotiation ? printDate(negotiation.creationDate) : "" }}</span>
          </li>
          <li class="list-group-item p-2 d-flex justify-content-between">
            <div>
              <div class="fw-bold text-primary-text">
                Status:
              </div>
              <span>{{ negotiation ? transformStatus(negotiation.status) : "" }}</span>
            </div>
          </li>

          <li
            v-if="userRole === availableRoles.ADMINISTRATOR && negotiation.status === 'SUBMITTED'"
            class="list-group-item p-2"
          >
            <div class="dropdown mt-3 mb-3">
              <button
                id="dropdownMenuButton1"
                class="btn btn-secondary dropdown-toggle me-3"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Select an Action
              </button>
              <ul
                class="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li
                  v-for="status in negotiationStatusOptions"
                  :key="status"
                  :value="status"
                >
                  <button
                    class="dropdown-item"
                    type="button"
                    @click="updateNegotiation(status)"
                  >
                    {{ transformStatus(status) }}
                  </button>
                </li>
              </ul>
            </div>
          </li>

          <li class="list-group-item p-2 btn-sm border-bottom-0">
            <PDFButton
              class="mt-2"
              :negotiation-pdf-data="negotiation"
            />
          </li>
          <li class="list-group-item p-2 border-bottom-0">
            <div class="pt-2 abandon-text">
              <div
                v-if="negotiation.status !== 'ABANDONED' && isUserRoleResearcher"
                type="button"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#abandonModal"
              >
                <span>
                  <i class="bi bi-trash pe-1" />
                  <span>Abandon</span>
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center flex-row"
  >
    <div class="d-flex justify-content-center">
      <div
        class="spinner-border d-flex justify-content-center "
        role="status"
      />
      <div class="d-flex justify-content-center">
        <h4 class="mb-3 ms-3">
          Loading ...
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue"
import NegotiationPosts from "@/components/NegotiationPosts.vue"
import NegotiationAttachment from "@/components/NegotiationAttachment.vue"
import PDFButton from "@/components/PDFButton.vue"
import { ROLES, dateFormat } from "@/config/consts"
import moment from "moment"
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const store = useStore()
const router = useRouter()

const props = defineProps({
  negotiationId: {
    type: String,
    default: undefined
  },
  userRole: {
    type: String,
    default: undefined
  }
})

const negotiation = ref(undefined)
const representedResourcesIds = ref([])
const negotiationStatusOptions = ref([])
const availableRoles = ref(ROLES)
const currentResourceEvents = ref([])
const savedResourceId = ref(undefined)
const selection = ref({})
const currentMultipleResourceStatus = ref(undefined)
const selectedStatus = ref(undefined)
const RESOURCE_TYPE = ref("RESOURCE")
const ORGANIZATION_TYPE = ref("ORGANIZATION")
const attachments = ref([])

const resources = computed(() => {
  return negotiation.value.resources
})

const organizations = computed(() => {
  return Object.entries(organizationsById.value).map(([k, v]) => { return { externalId: k, name: v.name } })
})

const organizationsById = computed(() => {
  return resources.value.reduce((organizations, resource) => {
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
})
const resourcesById = computed(() => {
  return resources.value.reduce((resourcesObjects, resource) => {
    resourcesObjects[resource.id] = resource
    return resourcesObjects
  }, {})
})

const numberOfResources = computed(() => {
  return resources.value.length
})

const representedResources = computed(() => {
  return resources.value.filter(resource => isRepresentativeForResource(resource.id))
})

const representedOrganizations = computed(() => {
  return representedResources.value.map(resource => resource.organization).filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.externalId === value.externalId
    ))
  )
})

const postsRecipients = computed(() => {
  if (props.userRole === ROLES.RESEARCHER) {
    return organizations.value.map(org => { return { id: org.externalId, name: org.name } })
  } else {
    return representedOrganizations.value.map(org => { return { id: org.externalId, name: org.name } })
  }
})

const author = computed(() => {
  return negotiation.value.author
})
const loading = computed(() => {
  return negotiation.value === undefined
})
const isUserRoleResearcher = computed(() => {
  return props.userRole === ROLES.RESEARCHER
})

onBeforeMount(async () => {
  negotiation.value = await store.dispatch("retrieveNegotiationById", { negotiationId: props.negotiationId })

  // initialize checkboxes selection
  let organizationsData
  let resourcesData
  if (props.userRole === ROLES.REPRESENTATIVE) {
    representedResourcesIds.value = await store.dispatch("retrieveUserRepresentedResources", {
      organizations: representedOrganizations.value,
      resources: representedResources.value
    })
  } else { // role is researcher
    organizationsData = organizations.value
    resourcesData = resources.value
  }

  organizationsData.forEach(org => {
    selection.value[org.externalId] = { checked: false, type: ORGANIZATION_TYPE.value }
  })
  resourcesData.forEach(res => {
    selection.value[res.id] = { checked: false, type: RESOURCE_TYPE.value }
  })

  negotiationStatusOptions.value = await store.dispatch("retrievePossibleEvents", { negotiationId: negotiation.value.id })
})

retrieveAttachments()

async function retrievePossibleEventsForResource (resourceId) {
  await store.dispatch("retrievePossibleEventsForResource", { negotiationId: negotiation.value.id, resourceId }).then((data) => {
    currentMultipleResourceStatus.value = getStatusForResource(resourceId)
    savedResourceId.value = resourceId
    currentResourceEvents.value = data
  })
}

async function retrieveAttachmentsByNegotiationId () {
  await store.dispatch("retrieveAttachmentsByNegotiationId", { negotiationId: props.negotiationId }).then((res) => {
    attachments.value = res
  })
}

async function updateNegotiationStatus (action) {
  await store.dispatch("updateNegotiationStatus", { negotiationId: props.negotiationId, event: action }).then(() => {
    router.replace({ params: { userRole: "ROLE_RESEARCHER" } })
  })
}

async function updateResourceStatus (event) {
  await store.dispatch("updateResourceStatus", { negotiationId: negotiation.value.id, resourceId: resource.value, event }).then(() => {
    // update status and status select
    router.go(0)
  })
}

async function downloadAttachment (attachment) {
  await store.dispatch("downloadAttachment", attachment)
}

async function retrieveAttachments () {
  await retrieveAttachmentsByNegotiationId()
}
function isRepresentativeForResource (resourceId) {
  return representedResourcesIds.value.includes(resourceId)
}
function isRepresentativeForOrganization (organizationId) {
  return representedOrganizations.value.map((org) => org.externalId).includes(organizationId)
}
function getStatusForResource (resourceId) {
  const resource = resourcesById.value[resourceId].status
  return transformStatus(resource)
}
function isAttachment (value) {
  return value instanceof Object
}
function printDate (date) {
  return moment(date).format(dateFormat)
}
async function updateNegotiation (action) {
  await updateNegotiationStatus(action)
}
function getElementIdFromResourceId (resourceId) {
  return resourceId.replaceAll(":", "_")
}
function selectAllOrganizationResource (org, event) {
  let checkedResource
  // sets the resource
  organizationsById.value[org]?.resources?.forEach(resource => {
    if (selection.value[resource.id]) {
      selection.value[resource.id].checked = event.target.checked
    }
    // checkedResource === undefined avoid overwriting the checkedResource each iteration
    if (checkedResource === undefined && selection.value[resource.id].checked === true) {
      checkedResource = resource.id
    }
  })
  // if at least one resource has been checked, set the multiple status for the resource as it happens by clicking
  // a single resource instead of the overall organisation multiple selection
  setCurrentMultipleStatus(checkedResource)
}
function isOrganizationButtonDisabled (resources) {
  const currentStatus = getStatusForResource(resources[0].id)
  // if this status is different from the current set multiple status (maybe coming from a
  // resource of another organization, then disable the button)
  if (currentMultipleResourceStatus.value !== undefined && currentStatus !== currentMultipleResourceStatus.value) {
    return true
  }
  for (let i = 1; i < resources.length; i++) {
    if (getStatusForResource(resources[i].id) !== currentStatus) {
      return true
    }
  }
  return false
}

function isResourceButtonDisabled (resourceId) {
  return currentMultipleResourceStatus.value !== undefined && getStatusForResource(resourceId) !== currentMultipleResourceStatus.value
}
async function setCurrentMultipleStatus (resourceId) {
  // If no resource is selected, it reset events and status
  if (resourceId === undefined ||
          !Object.values(selection.value).some((res) => res.type === RESOURCE_TYPE.value && res.checked === true)) {
    currentMultipleResourceStatus.value = undefined
    currentResourceEvents.value = []
  } else {
    if (currentMultipleResourceStatus.value === undefined) {
      retrievePossibleEventsForResource(resourceId)
    }
  }
  if (resourceId !== undefined) {
    const orgId = resourcesById.value[resourceId].organization.externalId
    // checks if all its resources are checked
    const allChecked = organizationsById.value[orgId].resources
      .every(res => res.id in selection.value && selection.value[res.id].checked === true)
    selection.value[orgId].checked = allChecked
  }
}
function isStatusComboDisabled () {
  return currentMultipleResourceStatus.value === undefined
}
async function updateCheckedResourcesStatus (event) {
  // For each of the settled resources, update the status to the one chosen in the combo
  for (const resource in selection.value) {
    if (selection.value[resource].checked === true && selection.value[resource].type === RESOURCE_TYPE.value) {
      await updateResourceStatus(event)
    }
  }
}
</script>

<style scoped>
.card-header[aria-expanded=true] .bi-chevron-down {
  display: none;
}
.card-header:not([aria-expanded]) .bi-chevron-up {
  display: none;
}
.card-header[aria-expanded=false] .bi-chevron-up {
  display: none;
}

.collections-header[aria-expanded=true] .bi-chevron-down {
  display: none;
}
.collections-header:not([aria-expanded]) .bi-chevron-up {
  display: none;
}
.collections-header[aria-expanded=false] .bi-chevron-up {
  display: none;
}
.abandon-text {
  color: #3c3c3d;
}
.abandon-text:hover {
  color: #dc3545;
}
</style>
