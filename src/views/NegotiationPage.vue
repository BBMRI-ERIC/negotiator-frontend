<template>
  <div
    v-if="!loading"
  >
    <button
      type="button"
      class="btn btn-secondary"
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

    <update-status-modal
      id="updateStatusModal"
      :resource-id="lifecycleResourceId"
      :options="currentResourceEvents"
      :visible="updateStatusVisible"
      @selected="updateResource"
    />

    <div class="row mt-4">
      <h1 class="text-primary fw-bold">
        {{ negotiation ? negotiation.payload.project.title.toUpperCase() : "" }}
      </h1>
      <div class="col-8">
        <ul class="list-group list-group-flush rounded border px-3 my-3">
          <li
            v-for="(element, key) in negotiation.payload"
            :key="element"
            class="list-group-item border-bottom p-3"
          >
            <span class="fs-5 fw-bold text-secondary border-bottom mt-3">
              {{ key.toUpperCase() }}</span>
            <div
              v-for="(subelement, subelementkey) in element"
              :key="subelement"
              class="mt-3"
            >
              <label
                class="me-2 fw-bold"
              >{{ subelementkey.toUpperCase() }}:</label>
              <span v-if="isAttachment(subelement)">
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
                {{ subelement }}
              </span>
            </div>
          </li>
          <li class="list-group-item p-3">
            <span class="fs-5 fw-bold text-secondary border-bottom mt-3 mb-3">
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
            <p
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#resourcesList"
              aria-expanded="false"
              aria-controls="resourcesList"
            >
              <span class="fs-5 fw-bold text-secondary border-bottom mt-3">
                <i class="bi bi-card-list" />
                COLLECTIONS ({{ numberOfResources }})
              </span>
            </p>
            <div
              id="resourcesList"
              class="collapse"
            >
              <ul>
                <li
                  v-for="resource in resources"
                  :key="resource.id"
                >
                  <div class="me-auto p-2">
                    <label class="me-2 fw-bold small">{{ resource.name }} ({{ resource.organization.name }}) </label>
                    <span>
                      {{ resource.status }}
                      <button
                        v-if="userRole === availableRoles.REPRESENTATIVE && isRepresentativeForResource(resource.id)"
                        class="btn btn-secondary btn-sm me-2 mb-1 float-end order-first"
                        data-bs-toggle="modal"
                        data-bs-target="#updateStatusModal"
                        @click.stop="interactLifecycleModal(resource.id)"
                      >
                        <i class="bi-gear" />
                      </button>
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <NegotiationPosts
          v-if="negotiation && negotiation.postsEnabled"
          :negotiation="negotiation"
          :user-role="userRole"
          :resources="resources"
          :organizations="organizationsById"
          :recipients="postsRecipients"
        />
        <div v-else>
          <h5>
            Your request is waiting for approval by our team. You will be notified of any changes via email.
          </h5>
        </div>
      </div>
      <div
        class="col-4"
      >
        <ul class="list-group list-group-flush my-3">
          <li class="list-group-item p-2">
            <div class="fw-bold text-secondary">
              Author:
            </div>
            <div>{{ author.name }}</div>
          </li>
          <li class="list-group-item p-2">
            <div class="fw-bold text-secondary">
              Negotiation ID:
            </div>
            <span> {{ negotiation ? negotiation.id : "" }}</span>
          </li>
          <li class="list-group-item p-2">
            <div class="fw-bold text-secondary">
              Status:
            </div>
            <span> {{ negotiation ? negotiation.status : "" }}
              <strong
                v-if="negotiation.status !== 'ABANDONED'"
                class="float-end"
                type="button"
                role="button"
                data-bs-toggle="modal"
                data-bs-target="#abandonModal"
              >
                <i class="bi bi-trash" />
                Abandon
              </strong>
            </span>
          </li>
        </ul>
        <div class="dropdown mt-3 mb-3">
          <button
            v-if="userRole === availableRoles.ADMINISTRATOR"
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
              v-for="response in responseOptions"
              :key="response"
              :value="response"
            >
              <button
                class="dropdown-item"
                type="button"
                @click="updateNegotiation(response)"
              >
                {{ response }}
              </button>
            </li>
          </ul>
        </div>
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
import UpdateStatusModal from "@/components/modals/UpdateStatusModal.vue"
import NegotiationAttachment from "@/components/NegotiationAttachment.vue"
import { ROLES, dateFormat } from "@/config/consts"
import moment from "moment"
import { mapActions, mapGetters } from "vuex"

export default {
  name: "NegotiationPage",
  components: {
    ConfirmationModal, UpdateStatusModal, NegotiationPosts, NegotiationAttachment
  },
  props: {
    negotiationId: {
      type: String,
      default: undefined,
    },
    userRole: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      negotiation: undefined,
      roles: [],
      responseOptions: [],
      lifecycleResourceId: undefined,
      availableRoles: ROLES,
      currentResourceEvents: []
    }
  },  
  computed: {
    ...mapGetters(["oidcUser"]),
    resources() {
      return this.negotiation.resources
    },
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
    numberOfResources() {
      return this.resources.length
    },
    representativeResources() {
      return this.resources.filter(resource => this.isRepresentativeForResource(resource.id))
    },
    representativeOrganizations() {
      return this.representativeResources.map(resource => resource.organization)
    },
    postsRecipients() {
      if (this.userRole === ROLES.RESEARCHER) {
        return this.organizations.map(org => { return { id: org.externalId, name: org.name } })
      } else {
        return this.representativeOrganizations.map(org => { return { id: org.externalId, name: org.name } })
      }
    },
    author() {
      for (const person of this.negotiation.persons) {
        if (person.role === ROLES.RESEARCHER) {
          return person
        }
      }
      return ""
    },
    loading() {
      return this.negotiation === undefined
    }
  },
  async beforeMount() {
    this.negotiation = await this.retrieveNegotiationById({
      negotiationId: this.negotiationId,
    }) 
    this.attachments = await this.retrieveAttachmentsByNegotiationId({
      negotiationId: this.negotiation.id
    })
    this.responseOptions = await this.retrievePossibleEvents({
      negotiationId: this.negotiation.id
    })
    this.roles = await this.retrieveUserRoles()
  },
  methods: {
    ...mapActions([
      "retrieveNegotiationById",
      "retrievePostsByNegotiationId",
      "retrieveUserRoles",
      "retrievePossibleEvents",
      "retrievePossibleEventsForResource",
      "retrieveAttachmentsByNegotiationId",
      "updateNegotiationStatus",
      "updateResourceStatus",
      "downloadAttachment"
    ]),
    async isRepresentativeForResource(resourceId) {
      return !!this.roles.includes(`${ROLES.REPRESENTATIVE}_${resourceId}`)
    },
    getStatusForCollection(resourceId) {
      if (this.negotiation.resourceStatus && typeof this.negotiation.resourceStatus === "object") {
        return this.negotiation.resourceStatus[resourceId] || ""
      } else {
        return ""
      }
    },
    isAttachment(value) {
      return value instanceof Object
    },
    printDate: function (date) {
      return moment(date).format(dateFormat)
    },
    async updateNegotiation(action) {
      await this.updateNegotiationStatus({
        negotiationId: this.negotiation.id,
        event: action
      })
    },
    async updateResource(status) {
      await this.updateResourceStatus({
        negotiationId: this.negotiation.id,
        resourceId: this.lifecycleResourceId,
        event: status,
      })
    },
    async loadPossibleEventsForResource(resourceId) {
      this.currentResourceEvents = await this.retrievePossibleEventsForResource({
        negotiationId: this.negotiation.id,
        resourceId: resourceId
      }).then((data) => {
        return data
      })
      
    },
    interactLifecycleModal(resourceId) {
      this.lifecycleResourceId = resourceId
      this.loadPossibleEventsForResource(resourceId)
    }
  },
}
</script>

<style scoped>
h1 {
  font-family: Calibri, Arial, sans-serif;
}
</style>