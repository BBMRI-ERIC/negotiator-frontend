<template>
  <div
    v-if="!loading"
  >
    <GoBackButton />
    <form-submission-modal
      id="formSubmissionModal"
      :title="requiredAccessForm.name"
      :negotiation-id="negotiationId"
      :requirement-id="requirementId"
      :resource-id="resourceId"
      :required-access-form="requiredAccessForm"
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
        /> {{ negotiation ? transformStatus(negotiation.status) : "" }}</span>
      </div>
      <div class="col-12 col-md-8 order-2 order-md-1">
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
                <span v-if="subelement.name">
                  {{ subelement.name }}
                  <font-awesome-icon
                    v-if="isAttachment(subelement)"
                    class="ms-1 cursor-pointer"
                    icon="fa fa-download"
                    fixed-width
                    @click.prevent="downloadAttachment({id: subelement.id, name: subelement.name})"
                  />
                </span>
                <span v-else>
                  <div
                    v-for="(choice,index) in subelement"
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
              <pre v-if="negotiation?.requests[0]?.humanReadable">{{ negotiation?.requests[0]?.humanReadable }}</pre>
              <pre
                v-else
                class="text-muted"
              > There are no data available </pre>
            </div>
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
                            ><i class="bi bi-patch-check" /> {{ link.name }}</a>
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
                        ><i class="bi bi-check-circle" />
                          {{ link.name }} </a>
                      </div>
                      <div
                        v-for="link in getRequirementLinks(resource._links)"
                        class="text-muted"
                      >
                        <a
                          class="requirement-text cursor-pointer"
                          @click="openModal(link.href, resource.id)"
                        ><i class="bi bi-exclamation-circle-fill" /> {{ link.title }} required</a>
                      </div>
                      <div
                        class="col-12 col-md-4 order-2 order-md-2"
                      />
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
        class="col-12 col-md-4 order-1 order-md-2"
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
          <li class="list-group-item p-2 border-bottom-0 flex-column d-flex">
            <a
              v-for="link in getSummaryLinks(negotiation._links)"
              class="cursor-pointer"
              @click="downloadAttachmentFromLink({href: link.href})"
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

<script>
import NegotiationPosts from "@/components/NegotiationPosts.vue"
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"
import NegotiationAttachment from "@/components/NegotiationAttachment.vue"
import GoBackButton from "@/components/GoBackButton.vue"
import CopyTextButton from "@/components/CopyTextButton.vue"
import { Modal } from "bootstrap"

import PDFButton from "@/components/PDFButton.vue"
import { ROLES, dateFormat } from "@/config/consts"
import moment from "moment"
import { mapActions, mapGetters } from "vuex"
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"
import FormViewModal from "@/components/modals/FormViewModal.vue"
import FormSubmissionModal from "@/components/modals/FormSubmissionModal.vue"
import { computed, ref } from "vue"

export default {
  name: "NegotiationPage",
  components: {
    FormSubmissionModal,
    FormViewModal,
    ConfirmationModal,
    NegotiationPosts,
    NegotiationAttachment,
    PDFButton,
    GoBackButton,
    CopyTextButton
  },
  props: {
    negotiationId: {
      type: String,
      default: undefined
    },
    userRole: {
      type: String,
      default: undefined
    }
  },
  setup () {
    const getSubmissionLinks = (links) => {
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
    return {
      getSubmissionLinks
    }
  },
  data () {
    return {
      infoRequirements: undefined,
      negotiation: undefined,
      requirementId: undefined,
      resources: [],
      resourceId: undefined,
      representedResourcesIds: [],
      negotiationStatusOptions: [],
      availableRoles: ROLES,
      currentResourceEvents: [],
      savedResourceId: undefined,
      selection: {},
      currentMultipleResourceStatus: undefined,
      selectedStatus: undefined,
      RESOURCE_TYPE: "RESOURCE",
      ORGANIZATION_TYPE: "ORGANIZATION",
      attachments: [],
      requiredAccessForm: {},
      formSubmissionModal: null,
      submittedForm: undefined,
      formViewModal: null
    }
  },
  computed: {
    ...mapGetters(["oidcUser"]),
    getResources () {
      return this.resources
    },
    organizations () {
      return Object.entries(this.organizationsById).map(([k, v]) => {
        return { externalId: k, name: v.name }
      })
    },
    organizationsById () {
      return this.getResources.reduce((organizations, resource) => {
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
    resourcesById () {
      return this.getResources.reduce((resourcesObjects, resource) => {
        resourcesObjects[resource.id] = resource
        return resourcesObjects
      }, {})
    },
    numberOfResources () {
      return this.getResources.length
    },
    representedResources () {
      return this.getResources.filter(resource => this.isRepresentativeForResource(resource.sourceId))
    },
    representedOrganizations () {
      console.log(this.representedResources)
      return this.representedResources.map(resource => resource.organization).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.externalId === value.externalId
        ))
      )
    },
    postsRecipients () {
      if (this.userRole === ROLES.RESEARCHER) {
        return this.organizations.map(org => {
          return { id: org.externalId, name: org.name }
        })
      } else {
        return this.representedOrganizations.map(org => {
          return { id: org.externalId, name: org.name }
        })
      }
    },
    author () {
      return this.negotiation.author
    },
    loading () {
      return (this.negotiation === undefined && this.resources.length === 0)
    },
    isUserRoleResearcher () {
      return this.userRole === ROLES.RESEARCHER
    }
  },
  async beforeMount () {
    this.negotiation = await this.retrieveNegotiationById({
      negotiationId: this.negotiationId
    })
    this.resources = await this.retrieveResourcesByNegotiationId({
      negotiationId: this.negotiationId
    })
    this.representedResourcesIds = await this.retrieveUserRepresentedResources()

    this.negotiationStatusOptions = await this.retrievePossibleEvents({
      negotiationId: this.negotiation.id
    })
  },
  created () {
    this.retrieveAttachments()
  },
  methods: {
    ...mapActions([
      "retrieveNegotiationById",
      "retrievePostsByNegotiationId",
      "retrieveUserRepresentedResources",
      "retrievePossibleEvents",
      "retrievePossibleEventsForResource",
      "retrieveAttachmentsByNegotiationId",
      "updateNegotiationStatus",
      "updateResourceStatus",
      "downloadAttachment",
      "downloadAttachmentFromLink",
      "retrieveInfoRequirement",
      "retrieveResourcesByNegotiationId",
      "retrieveInformationSubmission"
    ]),
    async retrieveAttachments () {
      await this.retrieveAttachmentsByNegotiationId({
        negotiationId: this.negotiationId
      }).then((response) => {
        this.attachments = response
      })
    },
    isRepresentativeForResource (resourceId) {
      return this.representedResourcesIds.includes(resourceId)
    },
    isRepresentativeForOrganization (organizationId) {
      return this.representedOrganizations.map((org) => org.externalId).includes(organizationId)
    },
    getStatusForResource (resourceId) {
      const resource = this.resourcesById[resourceId].currentState
      return this.transformStatus(resource)
    },
    isAttachment (value) {
      return value instanceof Object
    },
    printDate: function (date) {
      return moment(date).format(dateFormat)
    },
    async updateNegotiation (action) {
      await this.updateNegotiationStatus({
        negotiationId: this.negotiation.id,
        event: action
      }).then(() => {
        this.$router.replace({ params: { userRole: "ROLE_RESEARCHER" } })
      })
    },
    getElementIdFromResourceId (resourceId) {
      return resourceId.replaceAll(":", "_")
    },
    getRequirementLinks (links) {
      const requirementLinks = []
      for (const key in links) {
        if (key.startsWith("requirement-")) {
          requirementLinks.push(links[key])
        }
      }
      return requirementLinks
    },
    getLifecycleLinks (links) {
      const lifecycleLinks = []
      for (const key in links) {
        if (links[key].title === "Next Lifecycle event") {
          lifecycleLinks.push(links[key])
        }
      }
      return lifecycleLinks
    },
    getSummaryLinks (links) {
      console.log(links)
      const summaryLinks = []
      for (const key in links) {
        if (key.startsWith("Requirement summary")) {
          summaryLinks.push(links[key])
        }
      }
      console.log(summaryLinks)
      return summaryLinks
    },
    async openModal (href, resourceId) {
      let requirement
      requirement = await this.retrieveInfoRequirement({
        link: href
      })
      this.resourceId = resourceId
      this.requiredAccessForm = requirement.requiredAccessForm
      this.requirementId = requirement.id
      this.formSubmissionModal = new Modal(document.querySelector("#formSubmissionModal"))
      this.formSubmissionModal.show()
    },
    async openFormModal (href) {
      let payload
      payload = await this.retrieveInformationSubmission({
        href
      })
      this.submittedForm = payload.payload
      this.formViewModal = new Modal(document.querySelector("#formViewModal"))
      this.formViewModal.show()
    },
    async updateResourceState (link) {
      await this.updateResourceStatus({
        link
      })
      this.resources = await this.retrieveResourcesByNegotiationId({
        negotiationId: this.negotiationId
      })
    },
    transformStatus (badgeText) {
      return transformStatus(badgeText)
    },
    getBadgeColor (badgeText) {
      return getBadgeColor(badgeText)
    },
    getBadgeIcon (badgeText) {
      return getBadgeIcon(badgeText)
    },
    translateTrueFalse (value) {
      if (typeof value === "boolean") {
        return value ? "Yes" : "No"
      }
      return value
    },
    async hideFormSubmissionModal () {
      this.formSubmissionModal.hide()
      this.resources = await this.retrieveResourcesByNegotiationId({
        negotiationId: this.negotiationId
      })
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
.submission-text{
  color: green;
}
.requirement-text{
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
