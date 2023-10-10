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
      :options="responseOptions"
      :visible="updateStatusVisible"
      @selected="updateResource"
    />

    <private-post-modal
      v-for="collection in collections"
      :id="`privatePostModal${getElementIdFromCollectionId(collection)}`"
      :key="collection"
      :resource-id="collection"
      :negotiation="negotiation"
      :user-role="userRole"
      :visible="privatePostVisible"
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
            <p
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collectionsList"
              aria-expanded="false"
              aria-controls="collectionsList"
            >
              <span class="fs-5 fw-bold text-secondary border-bottom mt-3">
                <i class="bi bi-card-list" />
                COLLECTIONS ({{ numberOfCollections }})
              </span>
            </p>
            <div
              id="collectionsList"
              class="collapse"
            >
              <ul>
                <li
                  v-for="collection in collections"
                  :key="collection"
                >
                  <div class="me-auto p-2">
                    <label class="me-2 fw-bold small">{{ collection }}</label>
                    <span>
                      {{ getStatusForCollection(collection) }}
                      <button
                        v-if="(userRole === 'REPRESENTATIVE'
                          && isRepresentativeForResource(collection)) || loadPossibleEventsForSpecificResource(collection)"
                        class="btn btn-secondary btn-sm me-2 mb-1 float-end order-first"
                        data-bs-toggle="modal"
                        data-bs-target="#updateStatusModal"
                        @click.stop="interactLifecycleModal(collection)"
                      >
                        <i class="bi-gear" />
                      </button>
                      <button
                        v-if="negotiation && negotiation.postsEnabled"
                        type="button"
                        class="btn btn-secondary btn-sm me-2 mb-1 float-end"
                        :data-bs-target="`#privatePostModal${getElementIdFromCollectionId(collection)}`"
                        data-bs-toggle="modal"
                        @click.prevent="interactPrivatePostModal(collection)"
                      >
                        <i class="bi-chat-fill" />
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
          scope="public"
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
            <div>{{ authorName }}</div>
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
            v-if="userRole === 'ADMIN'"
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
import PrivatePostModal from "@/components/modals/PrivatePostModal.vue"
import { MESSAGE_STATUS, ROLES, dateFormat } from "@/config/consts"
import moment from "moment"
import { mapActions } from "vuex"

export default {
  name: "NegotiationPage",
  components: {
    ConfirmationModal, UpdateStatusModal, PrivatePostModal, NegotiationPosts,
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
      posts: [],
      message: {
        text: "",
        resourceId: undefined,
      },
      roles: [],
      responseOptions: [],
      selectedItem: "",
      messageStatus: MESSAGE_STATUS,
      showPrivatePostModal: false,
      privatePostResourceId: undefined,
      lifecycleResourceId: undefined,
      availableRoles: ROLES
    }
  },  
  computed: {
    collections() {
      const collections = []

      for (const request of this.negotiation.requests) {
        for (const resource of request.resources) {
          collections.push(resource.id)
        }
      }
      return collections
    },
    numberOfCollections() {
      return this.collections.length
    },
    authorName() {
      for (const person of this.negotiation.persons) {
        if (person.role === "RESEARCHER") {
          return person.name
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
      "updateNegotiationStatus",
      "updateResourceStatus",
      "downloadAttachment"
    ]),
    async isRepresentativeForResource(resourceId) {
      console.log(this.roles.includes("ROLE_REPRESENTATIVE_" + resourceId))
      return !!this.roles.includes("ROLE_REPRESENTATIVE_" + resourceId)

    },
    getStatusForCollection(collectionId) {
      if (this.negotiation.resourceStatus && typeof this.negotiation.resourceStatus === "object") {
        return this.negotiation.resourceStatus[collectionId] || ""
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
    loadPossibleEventsForResource() {
      this.retrievePossibleEventsForResource({
        negotiationId: this.negotiation.id,
        resourceId: this.lifecycleResourceId
      }).then((data) => {
        this.responseOptions = data
      })
    },
    async loadPossibleEventsForSpecificResource(resourceId) {
      if (this.userRole !== "RESEARCHER"){
        return false
      }
      let response
      this.retrievePossibleEventsForResource({
        negotiationId: this.negotiation.id,
        resourceId: resourceId
      }).then((data) => {
        response = data
      })
      return response.length > 0
    },
    interactPrivatePostModal(resourceId) {
      this.privatePostResourceId = resourceId
    },
    interactLifecycleModal(resourceId) {
      this.lifecycleResourceId = resourceId
      this.loadPossibleEventsForResource()
    },
    getElementIdFromCollectionId(collection) {
      return collection.replaceAll(":", "_")
    }
  },
}
</script>

<style scoped>
h1 {
  font-family: Calibri, Arial, sans-serif;
}
</style>