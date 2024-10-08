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
        /> {{ negotiation ?
          transformStatus(negotiation.status) : "" }}</span>
      </div>
      <div class="col-12 col-md-8 order-2 order-md-1">
        <ul class="list-group list-group-flush rounded border px-3 my-3">
            <li
            v-if="isNegotiationPayloadContainsTemplate(negotiation.payload)"
            v-for="(element, key) in negotiation.payload.templatePayload.sections"
            :key="element"
            class="list-group-item p-3"
          >
            <span class="fs-5 fw-bold text-primary-text mt-3">
              {{ transformDashToSpace(element.name).toUpperCase() }}</span>
            <div
              v-for="(subelement, subelementkey) of element.elements"
              :key="subelement.id"
              class="mt-3"
            >
              <label
                class="me-2 fw-bold text-secondary-text"
              >{{ transformDashToSpace(subelement.name).toUpperCase() }}:</label>
              <span
                v-if="isAttachment(subelement.value)"
                class="text-secondary-text"
              >
                <span v-if="subelement.value">
                  {{ subelement.value }}
                  <font-awesome-icon
                    v-if="isAttachment(subelement.value)"
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
                class="text-secondary-text text-break"
              >
                {{ translateTrueFalse(subelement.value) }}
              </span>
            </div>
          </li>
          <li
            v-else
            v-for="(element, key) in negotiation.payload"
            :key="key"
            class="list-group-item p-3"
          >
            <span class="fs-5 fw-bold text-primary-text mt-3">
              {{ transformDashToSpace(key).toUpperCase() }}</span>
            <div
              v-for="(subelement, subelementkey) in element"
              :key="subelement"
              class="mt-3"
            >
              <label
                class="me-2 fw-bold text-secondary-text"
              >{{ transformDashToSpace(subelementkey).toUpperCase() }}:</label>
              <span
                v-if="isAttachment(subelement)"
                class="text-secondary-text"
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
                class="text-secondary-text text-break"
              >
                {{ translateTrueFalse(subelement) }}
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
                <span class="fs-5 fw-bold text-primary-text mt-3">
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
                >
                  <span class="fs-5 fw-bold text-primary-text mt-3">
                    <i class="bi bi-card-list" />
                    COLLECTIONS ({{ numberOfResources }})
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
                  class="card-header cursor-pointer"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#card-body-block-${getElementIdFromResourceId(orgId)}`"
                  :aria-controls="`card-body-block-${getElementIdFromResourceId(orgId)}`"
                >
                  <div class="form-check d-flex justify-content-between cursor-pointer">
                    <div>
                      <label class="text-primary fw-bold ml-2 cursor-pointer">
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
                      <div class="d-flex flex-row align-items-center flex-row">
                        <div>
                          <label
                            class="form-check-label text-primary-text"
                            :for="getElementIdFromResourceId(resource.sourceId)"
                          >
                            {{ resource.name }}
                          </label>
                          <span class="badge rounded-pill bg-status-badge ms-4">
                            {{ getStatusForResource(resource.id) }}
                          </span>
                          <div class="text-muted">
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
                        class="text-muted"
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
                        class="text-muted"
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
          <li class="list-group-item p-2 border-bottom-0 flex-column d-flex">
            <a
              v-for="link in getSummaryLinks(negotiation._links)"
              class="cursor-pointer"
              @click="downloadAttachmentFromLink(link.href)"
            ><i class="bi bi-filetype-pdf" /> {{ link.title }}</a>
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
import { onBeforeMount, onMounted, ref, computed } from "vue"
import NegotiationPosts from "@/components/NegotiationPosts.vue"
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"
import NegotiationAttachment from "@/components/NegotiationAttachment.vue"
import GoBackButton from "@/components/GoBackButton.vue"
import CopyTextButton from "@/components/CopyTextButton.vue"
import { Modal } from "bootstrap"

import PDFButton from "@/components/PDFButton.vue"
import { dateFormat, ROLES } from "@/config/consts"
import moment from "moment"
import { getBadgeColor, getBadgeIcon, transformStatus } from "../composables/utils.js"
import FormViewModal from "@/components/modals/FormViewModal.vue"
import FormSubmissionModal from "@/components/modals/FormSubmissionModal.vue"
import { useNegotiationPageStore } from "../store/negotiationPage.js"
import { useUserStore } from "../store/user.js"
import { useAdminStore } from "../store/admin.js"
import AddResourcesButton from "@/components/AddResourcesButton.vue"
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

const infoRequirements = ref(undefined)
const negotiation = ref(undefined)
const requirementId = ref(undefined)
const resources = ref([])
const resourceId = ref(undefined)
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
const requiredAccessForm = ref({})
const formSubmissionModal = ref(null)
const submittedForm = ref(undefined)
const formViewModal = ref(null)
const isAddResourcesButtonVisible = ref(false)
const toParse = ref("Please read the <a href=\"https://www.canserv.eu/service-field-guidelines-open-call/\" target=\"_blank\">Service Field Guideline</a> as reference for the fields below")

const router = useRouter()
const userStore = useUserStore()
const negotiationPageStore = useNegotiationPageStore()
const adminStore = useAdminStore()

const getResources = computed(() => {
  return resources.value
})
const organizations = computed(() => {
  return Object.entries(organizationsById.value).map(([k, v]) => {
    return { externalId: k, name: v.name }
  })
})
const organizationsById = computed(() => {
  return getResources.value.reduce((organizations, resource) => {
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
  return getResources.value.reduce((resourcesObjects, resource) => {
    resourcesObjects[resource.id] = resource
    return resourcesObjects
  }, {})
})
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
const author = computed(() => {
  return negotiation.value.author
})
const loading = computed(() => {
  return (negotiation.value === undefined || resources.value.length === 0)
})
const isUserRoleResearcher = computed(() => {
  return props.userRole === ROLES.RESEARCHER
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
  representedResourcesIds.value = await negotiationPageStore.retrieveUserRepresentedResources()
  negotiationStatusOptions.value = await negotiationPageStore.retrievePossibleEvents(
    negotiation.value.id
  )
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
  return value && !Array.isArray(value) && typeof value === 'object';
}
function printDate (date) {
  return moment(date).format(dateFormat)
}
async function updateNegotiation (action) {
  await negotiationPageStore.updateNegotiationStatus(
    negotiation.value.id,
    action
  ).then(() => {
    router.replace({ params: { userRole: "ROLE_RESEARCHER" } })
  })
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
  if (text) { return text.split("-").join(" ") }

  return ""
}
function isNegotiationPayloadContainsTemplate (negotiationPayload) {
  return negotiationPayload.hasOwnProperty('templatePayload')
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

.submission-text {
  color: green;
}

.requirement-text {
  color: red;
}

.lifecycle-text:hover {
  color: orange;
}

.abandon-text {
  color: #3c3c3d;
}

.abandon-text:hover {
  color: #dc3545;
}
</style>
