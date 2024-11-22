<template>
  <div v-if="!loading">
    <GoBackButton />
    <form-submission-modal
      id="formSubmissionModal"
      :title="requiredAccessForm.name"
      :negotiation-id="negotiationId"
      :requirement-id="requirementId"
      :resource-id="resourceId"
      :required-access-form-id="requiredAccessForm.id"
      @confirm="hideFormSubmissionModal()"
    />
    <form-view-modal
      id="formViewModal"
      :payload="submittedForm"
    />
    <confirmation-modal
      id="abandonModal"
      :title="`Are you sure you want to ${selectedStatus ? selectedStatus.toLowerCase() : 'Unknown'} this Negotiation?`"
      text="Please confirm your action."
      @confirm="updateNegotiation()"
    />
    <confirmation-modal
      id="statusUpdateModal"
      :title="`Status update for ${selectedOrganization ? selectedOrganization.name : 'Unknown'}`"
      :text="`Are you sure you want to change the status of all ${selectedOrganization ? selectedOrganization.name : 'Unknown'} resources you represent in this Negotiation to ${orgStatus ? orgStatus.label : 'Unknown'} ?`"
      @confirm="updateOrganization()"
    />
    <confirmation-modal
      id="negotiationUpdateModal"
      title="Negotiation update"
      text="Are you sure you want to update Negotiation"
      @confirm="updateNegotiationPayload()"
    />
    <div class="row mt-4">
      <div class="row-col-2">
        <h1 class="fw-bold" :style="{ 'color': uiConfiguration.primaryTextColor }">
          {{ negotiation ? negotiation.payload.project.title?.toUpperCase() : "" }}
        </h1>
        <span
          :class="getBadgeColor(negotiation.status)"
          class="badge py-2 rounded-pill bg"
        ><i
          :class="getBadgeIcon(negotiation.status)"
          class="px-1"
        /> {{
          negotiation ?
            transformStatus(negotiation.status) : ""
        }}</span>
      </div>
      <div class="col-12 col-md-8 order-2 order-md-1">
        <ul class="list-group list-group-flush rounded border px-3 my-3">
          <li
            v-for="(element, key) in negotiation.payload"
            :key="element"
            class="list-group-item p-3"
          >
          <div v-if="negotiation?._links?.Update && Object.keys(negotiation.payload)[0] === key" class="position-absolute top-0 end-0 mt-2">
            <button type="button" class="btn text-black status-box cursor-pointer" data-bs-toggle="modal" data-bs-target="#negotiationUpdateModal"><i class="bi bi-pencil-square cursor-pointer" /></button>
          </div>
            <span class="fs-5 fw-bold mt-3" :style="{ 'color': uiConfiguration.primaryTextColor }">
              {{ transformDashToSpace(key).toUpperCase() }}</span>
            <div
              v-for="(subelement, subelementkey) in element"
              :key="subelement"
              class="mt-3"
            >
              <label
                class="me-2 fw-bold"
                :style="{ 'color': uiConfiguration.secondaryTextColor }"
              >{{ transformDashToSpace(subelementkey).toUpperCase() }}:</label>
              <span
                v-if="isAttachment(subelement)"
                :style="{ 'color': uiConfiguration.secondaryTextColor }"
              >
                <span v-if="subelement.name">
                  {{ subelement.name }}
                  <font-awesome-icon
                    v-if="isAttachment(subelement)"
                    class="ms-1 cursor-pointer"
                    icon="fa fa-download"
                    fixed-width
                    @click.prevent="downloadAttachment({ id: subelement.id, name: subelement.name })"
                  />
                </span>
                <span v-else>
                  <div
                    v-for="(choice, index) in subelement"
                    :key="index"
                  >
                    {{ choice }}
                  </div>
                </span>
              </span>
              <span
                v-else
                class="text-break"
                :style="{ 'color': uiConfiguration.secondaryTextColor }"
              >
                {{ translateTrueFalse(subelement) }}
              </span>
            </div>
          </li>
          <li class="list-group-item p-3">
            <span 
              class="fs-5 fw-bold mt-3 mb-3"
              :style="{ 'color': uiConfiguration.primaryTextColor }"
            >
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
              @download="downloadAttachment(attachment.id, attachment.name)"
            />
          </li>
          <li class="list-group-item p-3">
            <div
              class="d-flex flex-row mb-3 justify-content-between"
              style="min-height: 38px;"
            >
              <div
                data-bs-toggle="collapse"
                data-bs-target="#requestsHumanReadable"
                aria-controls="requestsHumanReadable"
                aria-expanded="true"
                type="button"
              >
                <span 
                  class="fs-5 fw-bold mt-3"
                  :style="{ 'color': uiConfiguration.primaryTextColor }"
                >
                  <i class="bi bi-diagram-3" />
                  SEARCH PARAMETERS
                </span>
              </div>
              <div
                data-bs-toggle="collapse"
                data-bs-target="#requestsHumanReadable"
                aria-controls="requestsHumanReadable"
                aria-expanded="false"
                type="button"
                class="collections-header justify-content-end pt-1"
              >
                <i class="bi bi-chevron-down" />
                <i class="bi bi-chevron-up" />
              </div>
            </div>
            <div
              id="requestsHumanReadable"
              class="collapse"
            >
              <pre v-if="negotiation?.humanReadable">{{ negotiation?.humanReadable }}</pre>
              <pre
                v-else
                class="text-muted"
              > There are no data available </pre>
            </div>
          </li>
          <li class="list-group-item p-3">
            <div class="d-flex flex-row mb-3 justify-content-between">
              <div class="d-flex flex-row">
                <div
                  data-bs-toggle="collapse"
                  data-bs-target="#resourcesList"
                  aria-controls="resourcesList"
                  aria-expanded="true"
                  type="button"
                  title="The term Resource is abstract and can for example refer to biological samples, datasets or a service such as sequencing."
                >
                  <span 
                    class="fs-5 fw-bold mt-3"
                    :style="{ 'color': uiConfiguration.primaryTextColor }"
                  >
                    <i class="bi bi-buildings mx-2" />
                    ORGANIZATIONS ({{ Object.keys(organizationsById).length }}) |
                    <i class="bi bi-box-seam" />
                    RESOURCES ({{ numberOfResources }})
                  </span>
                </div>
                <add-resources-button
                  v-if="isAddResourcesButtonVisible"
                  class="mb-1"
                  :negotiation-id="negotiationId"
                  @new-resources="reloadResources()"
                />
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
                  class="card-header"
                >
                  <div class="form-check d-flex">
                    <div
                      class="d-flex justify-content-end pt-1 p-1 cursor-pointer unpack align-items-center"
                      data-bs-toggle="collapse"
                      :data-bs-target="`#card-body-block-${getElementIdFromResourceId(orgId)}`"
                      :aria-controls="`card-body-block-${getElementIdFromResourceId(orgId)}`"
                    >
                      <div>
                        <i class="bi bi-chevron-down" />
                        <i class="bi bi-chevron-up" />
                      </div>
                      <div class="cursor-pointer">
                        <i class="bi bi-buildings mx-2" :style="{ 'color': uiConfiguration.primaryTextColor }"/>
                        <label 
                          class="fw-bold ml-2 cursor-pointer"
                          :style="{ 'color': uiConfiguration.secondaryTextColor }"
                        >
                          {{ org.name }}
                        </label>
                      </div>
                    </div>
                    <div class="ms-2 mx-2 ms-auto d-flex flex-column">
                      <div
                        class="ms-2 mx-2 ms-auto d-inline-flex align-items-center status-box p-1 cursor-pointer"
                        role="button"
                        title="Select current status.The term Resource is abstract and can for example refer to biological samples, datasets or a service such as sequencing."
                        @click="toggleDropdown(orgId)"
                      >
                        <span
                          class="badge"
                          :class="getStatusColor(org.status)"
                        >
                          <i
                            :class="getStatusIcon(org.status)"
                            class="px-1"
                          />
                          {{ org.status?.replace(/_/g, ' ') || '' }}
                        </span>
                        <i
                          v-if="org.updatable"
                          class="bi bi-caret-down-fill icon-smaller mx-1"
                        />
                      </div>
                      <div>
                        <ul
                          v-if="org.updatable"
                          class="dropdown-menu"
                          :class="{ 'show': dropdownVisible[orgId] }"
                        >
                          <li
                            v-for="state in sortedStates"
                            :key="state.value"
                            class="dropdown-item cursor-pointer"
                            data-bs-toggle="modal"
                            data-bs-target="#statusUpdateModal"
                            @click="updateOrgStatus(state, org, orgId)"
                          >
                            <i
                              :class="getStatusIcon(state.value)"
                              class="px-1"
                            />
                            {{ state.label }}
                          </li>
                        </ul>
                      </div>
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
                      <div class="d-flex flex-row align-items-center flex-row">
                        <div>
                          <label
                            class="form-check-label"
                            :style="{ 'color': uiConfiguration.primaryTextColor }"
                            :for="getElementIdFromResourceId(resource.sourceId)"
                          >
                            <i class="bi bi-box-seam" />
                            {{ resource.name }}
                          </label>
                          <span class="badge rounded-pill bg-status-badge ms-4">
                            {{ getStatusForResource(resource.id) }}
                          </span>
                          <div :style="{ 'color': uiConfiguration.primaryTextColor, 'opacity': 0.7 }">
                            {{ resource.sourceId }}
                            <CopyTextButton :text="resource.sourceId" />
                          </div>
                        </div>
                        <div
                          v-if="getLifecycleLinks(resource._links).length > 0"
                          class="ms-4"
                        >
                          Update status:
                          <div
                            v-for="link in getLifecycleLinks(resource._links)"
                            class="lifecycle-links flex-column ms-4"
                          >
                            <a
                              class="lifecycle-text cursor-pointer"
                              @click="updateResourceState(link.href)"
                            ><i
                              class="bi bi-patch-check"
                            /> {{ link.name }}</a>
                          </div>
                        </div>
                      </div>

                      <div
                        v-for="link in getSubmissionLinks(resource._links)"
                      >
                        <a
                          class="submission-text cursor-pointer"
                          @click.prevent="openFormModal(link.href)"
                        ><i
                           class="bi bi-check-circle"
                         />
                          {{ link.name }} </a>
                      </div>
                      <div
                        v-for="link in getRequirementLinks(resource._links)"
                      >
                        <a
                          class="requirement-text cursor-pointer"
                          @click="openModal(link.href, resource.id)"
                        ><i
                          class="bi bi-exclamation-circle-fill"
                        /> {{ link.title }} required</a>
                      </div>
                      <div class="col-12 col-md-4 order-2 order-md-2" />
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
          @new_attachment="retrieveAttachments()"
        />
      </div>
      <div class="col-12 col-md-4 order-1 order-md-2">
        <ul class="list-group list-group-flush my-3">
          <li class="list-group-item p-2">
            <div 
              class="fw-bold"
              :style="{ 'color': uiConfiguration.primaryTextColor }"
            >
              Author:
            </div>
            <div 
              :style="{ 'color': uiConfiguration.secondaryTextColor }"
            >
              {{ author.name }}
            </div>
          </li>
          <li class="list-group-item p-2">
            <div 
              class="fw-bold"
              :style="{ 'color': uiConfiguration.primaryTextColor }"
            >
              Email:
            </div>
            <span :style="{ 'color': uiConfiguration.secondaryTextColor }">{{ author.email }}</span>
          </li>
          <li class="list-group-item p-2">
            <div 
              class="fw-bold"
              :style="{ 'color': uiConfiguration.primaryTextColor }"
            >
              Negotiation ID:
            </div>
            <span :style="{ 'color': uiConfiguration.secondaryTextColor }"> {{ negotiation ? negotiation.id : "" }}</span>
          </li>
          <li class="list-group-item p-2">
            <div 
              class="fw-bold"
              :style="{ 'color': uiConfiguration.primaryTextColor }"
            >
              Submitted at:
            </div>
            <span :style="{ 'color': uiConfiguration.secondaryTextColor }"> {{ negotiation ? printDate(negotiation.creationDate) : "" }}</span>
          </li>
          <li class="list-group-item p-2 d-flex justify-content-between">
            <div>
              <div 
                class="fw-bold"
                :style="{ 'color': uiConfiguration.primaryTextColor }"
              >
                Status:
              </div>
              <span
                :class="getBadgeColor(negotiation.status)"
                class="badge py-2 rounded-pill bg"
              ><i
                :class="getBadgeIcon(negotiation.status)"
                class="px-1"
              /> {{
                negotiation ?
                  transformStatus(negotiation.status) : ""
              }}</span>
            </div>
          </li>
          <li 
            v-if="getLifecycleLinks(negotiation._links).length > 0"
            class="list-group-item p-2 d-flex justify-content-between"
          >
            <ul class="list-unstyled mt-1 d-flex flex-row flex-wrap">
              <li
                  v-for="link in getLifecycleLinks(negotiation._links)"
                  :key="link.name"
                  class="me-2"
                >
                  <button
                    :class="getButtonColor(link.name)"
                    class="btn btn-status mb-1 d-flex text-left"
                    data-bs-toggle="modal"
                    data-bs-target="#abandonModal"
                    @click="assignStatus(link.name)"
                  >
                    <i
                      :class="getButtonIcon(link.name)"
                    />
                    {{ link.name }}
                  </button>
                </li>
            </ul>
          </li>
          <li
            v-if="userRole === availableRoles.ADMINISTRATOR && negotiation.status === 'SUBMITTED'"
            class="list-group-item p-2"
          />

          <li class="list-group-item p-2 btn-sm border-bottom-0">
            <PDFButton
              class="mt-2"
              :negotiation-pdf-data="negotiation"
            />
          </li>
          <li
            v-if="getSummaryLinks(negotiation._links).length > 0"
            class="list-group-item p-2 border-bottom-0 flex-column d-flex"
          >
            <a
              v-for="link in getSummaryLinks(negotiation._links)"
              :key="link"
              class="cursor-pointer"
              :style="{ 'color': uiConfiguration.primaryTextColor }"
              @click="downloadAttachmentFromLink(link.href)"
            ><i class="bi bi-filetype-pdf" /> {{ link.title }}</a>
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
import { computed, onBeforeMount, onMounted, reactive, ref } from "vue"
import NegotiationPosts from "@/components/NegotiationPosts.vue"
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"
import NegotiationAttachment from "@/components/NegotiationAttachment.vue"
import GoBackButton from "@/components/GoBackButton.vue"
import CopyTextButton from "@/components/CopyTextButton.vue"
import { Modal } from "bootstrap"

import PDFButton from "@/components/PDFButton.vue"
import { dateFormat, ROLES } from "@/config/consts"
import moment from "moment"
import {
  getBadgeColor,
  getBadgeIcon,
  getButtonColor,
  getButtonIcon,
  getStatusColor,
  getStatusIcon,
  transformStatus
} from "../composables/utils.js"
import FormViewModal from "@/components/modals/FormViewModal.vue"
import FormSubmissionModal from "@/components/modals/FormSubmissionModal.vue"
import AddResourcesButton from "@/components/AddResourcesButton.vue"
import { useNegotiationPageStore } from "../store/negotiationPage.js"
import { useUserStore } from "../store/user.js"
import { useAdminStore } from "../store/admin.js"
import { useUiConfiguration } from '@/store/uiConfiguration.js'
import { useRouter } from "vue-router"

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

function getSubmissionLinks (links) {
  const submissionLinks = []
  for (const key in links) {
    // Check if the key starts with "submission-"
    if (key.startsWith("submission-")) {
      // Push the href value of the link to the submissionLinks array
      submissionLinks.push(links[key])
    }
  }
  return submissionLinks
}
const uiConfigurationStore = useUiConfiguration()
const infoRequirements = ref(undefined)
const negotiation = ref(undefined)
const requirementId = ref(undefined)
const resources = ref([])
const resourceId = ref(undefined)
const representedResourcesIds = ref([])
const negotiationStatusOptions = ref([])
const availableRoles = ref(ROLES)
const selectedStatus = ref(undefined)
const attachments = ref([])
const requiredAccessForm = ref({})
const formSubmissionModal = ref(null)
const submittedForm = ref(undefined)
const formViewModal = ref(null)
const isAddResourcesButtonVisible = ref(false)
const resourceStates = ref([])
const toParse = ref("Please read the <a href=\"https://www.canserv.eu/service-field-guidelines-open-call/\" target=\"_blank\">Service Field Guideline</a> as reference for the fields below")
const dropdownVisible = reactive({})
const selectedOrganization = ref(undefined)
const orgStatus = ref(undefined)
const userStore = useUserStore()
const negotiationPageStore = useNegotiationPageStore()
const adminStore = useAdminStore()
const router = useRouter()

const uiConfiguration = computed(() => {
    return uiConfigurationStore.uiConfiguration?.theme
})
const getResources = computed(() => {
  return resources.value
})
const organizations = computed(() => {
  return Object.entries(organizationsById.value).map(([k, v]) => {
    return { externalId: k, name: v.name }
  })
})
const organizationsById = computed(() => {
  // Create a map of state ordinals for quick lookup
  const stateOrdinalMap = resourceStates.value.reduce((map, state) => {
    map[state.value] = state.ordinal
    return map
  }, {})

  return getResources.value.reduce((organizations, resource) => {
    const currentState = resource.currentState
    const currentOrdinal = stateOrdinalMap[currentState] || 0 // Default to 0 if no match found

    const orgId = resource.organization.externalId

    if (orgId in organizations) {
      // Push the resource to the organization's resources array
      organizations[orgId].resources.push(resource)

      // Check if the current resource state has a higher ordinal
      const orgStatusOrdinal = stateOrdinalMap[organizations[orgId].status] || 0
      if (currentOrdinal > orgStatusOrdinal) {
        organizations[orgId].status = currentState // Update org status to the one with the highest ordinal
      }

      // Check if the organization has at least one represented resource
      if (isResourceRepresented(resource)) {
        organizations[orgId].updatable = true
      }
    } else {
      // Add a new organization entry
      organizations[orgId] = {
        name: resource.organization.name,
        resources: [resource],
        status: currentState, // Set initial status
        updatable: isResourceRepresented(resource) // Set updateable to true if any resource is represented
      }
    }

    return organizations
  }, {})
})

// Helper function to check if a resource is represented
function isResourceRepresented (resource) {
  console.log(resource)
  for (const key in resource._links) {
    if (resource._links[key].title === "Next Lifecycle event") {
      return true
    }
  }
  return false
}

const resourcesById = computed(() => {
  return getResources.value.reduce((resourcesObjects, resource) => {
    resourcesObjects[resource.id] = resource
    return resourcesObjects
  }, {})
})
const toggleDropdown = (orgId) => {
  dropdownVisible[orgId] = !dropdownVisible[orgId]
}
const numberOfResources = computed(() => {
  return getResources.value.length
})
const representedResources = computed(() => {
  return getResources.value.filter(resource => isRepresentativeForResource(resource.sourceId))
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
    return organizations.value.map(org => {
      return { id: org.externalId, name: org.name }
    })
  } else {
    return representedOrganizations.value.map(org => {
      return { id: org.externalId, name: org.name }
    })
  }
})
const sortedStates = computed(() => {
  return resourceStates.value.slice().sort((a, b) => Number(a.ordinal) - Number(b.ordinal))
})
function assignStatus (status) {
  selectedStatus.value = status.toUpperCase()
}
const author = computed(() => {
  return negotiation.value.author
})
const loading = computed(() => {
  return (negotiation.value === undefined || resources.value.length === 0)
})

onBeforeMount(async () => {
  negotiation.value = await negotiationPageStore.retrieveNegotiationById(
    props.negotiationId
  )
  const resourceResponse = await negotiationPageStore.retrieveResourcesByNegotiationId(props.negotiationId)
  if (resourceResponse?._embedded?.resources !== undefined) {
    resources.value = resourceResponse._embedded.resources
    isAddResourcesButtonVisible.value = hasRightsToAddResources(resourceResponse._links)
  }
  await negotiationPageStore.retrieveUserIdRepresentedResources(userStore.userInfo?.id).then((resp) => {
    representedResourcesIds.value = resp.map(a => a.sourceId)
  })
  negotiationStatusOptions.value = getLifecycleLinks(negotiation.value._links)
  resourceStates.value = await negotiationPageStore.retrieveResourceAllStates()
})

retrieveAttachments()

onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser()
  }
})

async function retrieveAttachments () {
  await negotiationPageStore.retrieveAttachmentsByNegotiationId(
    props.negotiationId
  ).then((response) => {
    attachments.value = response
  })
}

function hasRightsToAddResources (links) {
  for (const key in links) {
    if (key === "add_resources") {
      return true
    }
  }
  return false
}

function isRepresentativeForResource (resourceId) {
  return representedResourcesIds.value.includes(resourceId)
}

function isRepresentativeForOrganization (organizationId) {
  return representedOrganizations.value.map((org) => org.externalId).includes(organizationId)
}

function getStatusForResource (resourceId) {
  const resource = resourcesById.value[resourceId].currentState
  return transformStatus(resource)
}

function isAttachment (value) {
  return value instanceof Object
}

function printDate (date) {
  return moment(date).format(dateFormat)
}

async function updateNegotiation () {
  await negotiationPageStore.updateNegotiationStatus(
    negotiation.value.id,
    selectedStatus.value
  ).then(async () => {
    negotiation.value = await negotiationPageStore.retrieveNegotiationById(
      props.negotiationId
    )
  })
  await reloadResources()
}

async function updateOrganization () {
  console.log(selectedOrganization.value)
  const
    data = {
      resourceIds: getRepresentedResources(selectedOrganization.value.resources),
      state: orgStatus.value.value
    }
  const negotiationId = props.negotiationId
  await negotiationPageStore.addResources(data, negotiationId)
  await reloadResources()
}
async function updateOrgStatus (state, organization, orgId) {
  toggleDropdown(orgId)
  selectedOrganization.value = organization
  orgStatus.value = state
}

function getElementIdFromResourceId (resourceId) {
  return resourceId.replaceAll(":", "_")
}

function getRequirementLinks (links) {
  const requirementLinks = []
  for (const key in links) {
    if (key.startsWith("requirement-")) {
      requirementLinks.push(links[key])
    }
  }
  return requirementLinks
}
function getRepresentedResources (resources) {
  const resourceIds = []

  // Use for...of to iterate over the array of resources
  for (const resource of resources) {
    // Iterate over the _links of the resource
    for (const key in resource._links) {
      if (resource._links[key].title === "Next Lifecycle event") {
        resourceIds.push(resource.id)
        break // Exit inner loop when condition is met
      }
    }
  }
  console.log(resourceIds)
  return resourceIds
}

function getLifecycleLinks (links) {
  const lifecycleLinks = []
  for (const key in links) {
    if (links[key].title === "Next Lifecycle event") {
      lifecycleLinks.push(links[key])
    }
  }
  return lifecycleLinks
}

function getSummaryLinks (links) {
  const summaryLinks = []
  for (const key in links) {
    if (key.startsWith("Requirement summary")) {
      summaryLinks.push(links[key])
    }
  }
  return summaryLinks
}

async function openModal (href, resourcesId) {
  const requirement = await negotiationPageStore.retrieveInfoRequirement(href)
  resourceId.value = resourcesId
  requiredAccessForm.value = requirement.requiredAccessForm
  requirementId.value = requirement.id
  formSubmissionModal.value = new Modal(document.querySelector("#formSubmissionModal"))
  formSubmissionModal.value.show()
}

async function openFormModal (href) {
  const payload = await negotiationPageStore.retrieveInformationSubmission(href)
  submittedForm.value = payload.payload
  formViewModal.value = new Modal(document.querySelector("#formViewModal"))
  formViewModal.value.show()
}

async function updateResourceState (link) {
  await negotiationPageStore.updateResourceStatus(link)
  reloadResources()
}

function translateTrueFalse (value) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No"
  }
  return value
}

async function reloadResources () {
  const resourceResponse = await negotiationPageStore.retrieveResourcesByNegotiationId(props.negotiationId)
  if (resourceResponse._embedded.resources !== undefined) {
    resources.value = resourceResponse._embedded.resources
  }
}

async function hideFormSubmissionModal () {
  formSubmissionModal.value.hide()
  await reloadResources()
}

function downloadAttachment (id, name) {
  negotiationPageStore.downloadAttachment(id, name)
}

function downloadAttachmentFromLink (href) {
  negotiationPageStore.downloadAttachmentFromLink(href)
}

async function retrieveInfoRequirement (link) {
  adminStore.retrieveInfoRequirement(link)
}

function transformDashToSpace (text) {
  if (text) {
    return text.split("-").join(" ")
  }

  return ""
}

function updateNegotiationPayload () {
  router.push(`/edit/requests/${props.negotiationId}`)
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

.icon-smaller {
  font-size: 0.85em; /* Make the icon smaller */
  position: relative;
  top: 2px; /* Adjust this value to lower the icon */
  color: black;
}

.submission-text {
  color: green;
  opacity: 0.7
}
.unpack:hover {
  background-color: lightgray;    /* Light gray background on hover */
  color: #212529;               /* Darker text color on hover */
}
.status-box:hover {
  background-color: lightgray;    /* Light gray background on hover */
  color: #212529;               /* Darker text color on hover */
}

.requirement-text {
  color: red;
  opacity: 0.7
}

.lifecycle-text:hover {
  color: orange;
}

.abandon-text {
  color: #3c3c3d;
}
.btn-status{
  color: white;
  min-width: 100%;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
  width: 100px;
  gap: 8px;
}
.nav-item.dropdown .dropdown-menu {
  min-width: 140px;               /* Set the minimum width of the dropdown */
  max-width: 200px;            /* Ensure it doesn't exceed the width of the navbar item */
  background-color: #e7e7e7;    /* Light gray background to match the Bootstrap light navbar */
  border: 1px solid #dee2e6;    /* Light border for the dropdown */
  border-radius: 0;             /* No border-radius for a flush fit with the navbar */
  box-shadow: none;             /* Remove shadow for a flat appearance */
}

.nav-item.dropdown .dropdown-item {
  white-space: nowrap;          /* Prevent text from wrapping */
  overflow: hidden;
  text-overflow: ellipsis;      /* Ellipsis for overflowing text */
  color: #495057;               /* Darker gray text color to match Bootstrap's default text */
  background-color: #e7e7e7;
}
.nav-item:hover .nav-link,
.nav-item.dropdown .dropdown-item:hover,
.nav-item.dropdown .dropdown-item:focus {
  background-color: lightgray;    /* Light gray background on hover */
  color: #212529;               /* Darker text color on hover */
}
.abandon-text:hover {
  color: #dc3545;
}
</style>
