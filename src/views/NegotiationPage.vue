<template>
  <div
    v-if="!loading"
  >
    <GoBackButton />
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
                data-bs-target="#resourcesList"
                aria-controls="resourcesList"
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
                      <div class="text-muted">
                        {{ resource.id }} <CopyTextButton :text="resource.id" />
                      </div>
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

<script>
import NegotiationPosts from "@/components/NegotiationPosts.vue"
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"
import NegotiationAttachment from "@/components/NegotiationAttachment.vue"
import GoBackButton from "@/components/GoBackButton.vue"
import CopyTextButton from "@/components/CopyTextButton.vue"

import PDFButton from "@/components/PDFButton.vue"
import { ROLES, dateFormat } from "@/config/consts"
import moment from "moment"
import { mapActions, mapGetters } from "vuex"
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"

export default {
  name: "NegotiationPage",
  components: {
    ConfirmationModal, NegotiationPosts, NegotiationAttachment, PDFButton, GoBackButton, CopyTextButton
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
  data () {
    return {
      negotiation: undefined,
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
      attachments: []
    }
  },
  computed: {
    ...mapGetters(["oidcUser"]),
    resources () {
      return this.negotiation.resources
    },
    organizations () {
      return Object.entries(this.organizationsById).map(([k, v]) => { return { externalId: k, name: v.name } })
    },
    organizationsById () {
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
    resourcesById () {
      return this.resources.reduce((resourcesObjects, resource) => {
        resourcesObjects[resource.id] = resource
        return resourcesObjects
      }, {})
    },
    numberOfResources () {
      return this.resources.length
    },
    representedResources () {
      return this.resources.filter(resource => this.isRepresentativeForResource(resource.id))
    },
    representedOrganizations () {
      return this.representedResources.map(resource => resource.organization).filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.externalId === value.externalId
        ))
      )
    },
    postsRecipients () {
      if (this.userRole === ROLES.RESEARCHER) {
        return this.organizations.map(org => { return { id: org.externalId, name: org.name } })
      } else {
        return this.representedOrganizations.map(org => { return { id: org.externalId, name: org.name } })
      }
    },
    author () {
      return this.negotiation.author
    },
    loading () {
      return this.negotiation === undefined
    },
    isUserRoleResearcher () {
      return this.userRole === ROLES.RESEARCHER
    }
  },
  async beforeMount () {
    this.negotiation = await this.retrieveNegotiationById({
      negotiationId: this.negotiationId
    })

    // initialize checkboxes selection
    let organizations, resources
    if (this.userRole === ROLES.REPRESENTATIVE) {
      this.representedResourcesIds = await this.retrieveUserRepresentedResources()
      organizations = this.representedOrganizations
      resources = this.representedResources
    } else { // role is researcher
      organizations = this.organizations
      resources = this.resources
    }

    organizations.forEach(org => {
      this.selection[org.externalId] = { checked: false, type: this.ORGANIZATION_TYPE }
    })
    resources.forEach(res => {
      this.selection[res.id] = { checked: false, type: this.RESOURCE_TYPE }
    })

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
      "downloadAttachment"
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
      const resource = this.resourcesById[resourceId].status
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
    selectAllOrganizationResource (org, event) {
      let checkedResource
      // sets the resource
      this.organizationsById[org]?.resources?.forEach(resource => {
        if (this.selection[resource.id]) { this.selection[resource.id].checked = event.target.checked }
        // checkedResource === undefined avoid overwriting the checkedResource each iteration
        if (checkedResource === undefined && this.selection[resource.id].checked === true) {
          checkedResource = resource.id
        }
      })

      // if at least one resource has been checked, set the multiple status for the resource as it happens by clicking
      // a single resource instead of the overall organisation multiple selection
      this.setCurrentMultipleStatus(checkedResource)
    },
    isOrganizationButtonDisabled (resources) {
      const currentStatus = this.getStatusForResource(resources[0].id)
      // if this status is different from the current set multiple status (maybe coming from a
      // resource of another organization, then disable the button)
      if (this.currentMultipleResourceStatus !== undefined && currentStatus !== this.currentMultipleResourceStatus) {
        return true
      }
      for (let i = 1; i < resources.length; i++) {
        if (this.getStatusForResource(resources[i].id) !== currentStatus) {
          return true
        }
      }
      return false
    },
    isResourceButtonDisabled (resourceId) {
      return this.currentMultipleResourceStatus !== undefined && this.getStatusForResource(resourceId) !== this.currentMultipleResourceStatus
    },
    async setCurrentMultipleStatus (resourceId) {
      // If no resource is selected, it reset events and status
      if (resourceId === undefined ||
          !Object.values(this.selection).some((res) => res.type === this.RESOURCE_TYPE && res.checked === true)) {
        this.currentMultipleResourceStatus = undefined
        this.currentResourceEvents = []
      } else {
        if (this.currentMultipleResourceStatus === undefined) {
          this.currentResourceEvents = await this.retrievePossibleEventsForResource({
            negotiationId: this.negotiation.id,
            resourceId
          }).then((data) => {
            this.currentMultipleResourceStatus = this.getStatusForResource(resourceId)
            this.savedResourceId = resourceId
            // gets the orgId of the organization of the checked resource
            return data
          })
        }
      }
      if (resourceId !== undefined) {
        const orgId = this.resourcesById[resourceId].organization.externalId
        // checks if all its resources are checked
        const allChecked = this.organizationsById[orgId].resources
          .every(res => res.id in this.selection && this.selection[res.id].checked === true)
        this.selection[orgId].checked = allChecked
      }
    },
    isStatusComboDisabled () {
      return this.currentMultipleResourceStatus === undefined
    },
    async updateCheckedResourcesStatus (event) {
      // For each of the settled resources, update the status to the one chosen in the combo
      try {
        for (const resource in this.selection) {
          if (this.selection[resource].checked === true && this.selection[resource].type === this.RESOURCE_TYPE) {
            await this.updateResourceStatus({
              negotiationId: this.negotiation.id,
              resourceId: resource,
              event
            })
          }
        }
      } finally {
        // update status and status select
        location.reload()
      }
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
