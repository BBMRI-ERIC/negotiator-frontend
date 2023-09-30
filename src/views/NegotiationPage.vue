<template>
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
  <div
    v-if="isNegotiationLoaded"
    style="margin-top: 20px"
  >
    <h1>
      {{ negotiation ? negotiation.payload.project.title.toUpperCase() : "" }}
    </h1>
    <div class="row">
      <div class="col-8">
        <ul class="border mt-3">
          <li
            v-for="(element, key) in negotiation.payload"
            :key="element"
            class="list-group-item  border-bottom"
          >
            <span class="fs-5 fw-bold text-secondary border-bottom mt-3">
              {{ key.toUpperCase() }}</span>
            <div
              v-for="(subelement, subelementkey) in element"
              :key="subelement"
              class="mt-3"
            >
              <label
                class="me-2 ml=fw-bold"
                style="font-weight: bold"
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
          <li class="list-group-item ">
            <p
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseExample"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <span class="fs-5 fw-bold text-secondary border-bottom mt-3">
                <i class="bi bi-card-list" />
                Collections ({{ numberOfCollections }})
              </span>
            </p>
            <div
              id="collapseExample"
              class="collapse"
            >
              <div class="card card-body border-0">
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
                          v-if="userRole === 'REPRESENTATIVE' && negotiation.status === 'ONGOING' && isRepresentativeForResource(collection)"
                          class="btn btn-secondary btn-sm me-2 mb-1  float-end order-first"
                          @click.stop="interactLifecycleModal(collection)"
                        >
                          <i class="bi-gear" />
                        </button>
                        <button
                          type="button"
                          class="btn btn-secondary btn-sm me-2 mb-1 float-end"
                          @click.stop="interactPrivatePostModal(key)"
                        >
                          <i class="bi-chat-fill" />
                        </button>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        <NegotiationPosts
          :negotiation="negotiation"
          :user-role="userRole"
          scope="public"
        />
      </div>
      <div
        class="col-4"
      >
        <ul class="list-group">
          <li class="list-group-item">
            <div class="fw-bold text-secondary">
              Author:
            </div>
            <div>{{ authorName }}</div>
          </li>
          <li class="list-group-item">
            <div class="fw-bold text-secondary">
              Negotiation ID:
            </div>
            <span> {{ negotiation ? negotiation.id : "" }}</span>
          </li>
          <li class="list-group-item">
            <div class="fw-bold text-secondary">
              Status:
            </div>
            <span> {{ negotiation ? negotiation.status : "" }}
              <strong
                class="float-end"
                type="button"
                role="button"
                @click="showConfirmationDialog"
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
  <hr class="mt-10 mb-10">

  <div
    v-if="showPrivatePostModal"
    class="modal"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">
            Resource ID: {{ privatePostResourceId }}
          </h1>
        </div>
        <div class="modal-body">
          <NegotiationPosts 
            :negotiation="negotiation"
            :user-role="userRole"
            scope="private"
            :resource-id="privatePostResourceId"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            @click="showPrivatePostModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-show="showLifecycleModal"
    class="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">
            Resource ID: {{ lifecycleResourceId }}
          </h1>
        </div>
        <div class="modal-body">
          <label for="actions">Respond:</label>
          <select v-model="selectedItem">
            <option
              v-for="response in responseOptions"
              :key="response"
              :value="response"
            >
              {{ response }}
            </option>
          </select>
          <p>Selected item: {{ selectedItem }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            @click="showLifecycleModal = false"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="updateResource"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
  <confirmation-modal
    v-if="showConfirmationModal"
    @close-confirmation-modal="showConfirmationDialog"
    @abandon-negotiation="updateNegotiation('ABANDON')"
  />
</template>

<script>
import NegotiationPosts from "@/components/NegotiationPosts.vue"
import { MESSAGE_STATUS, ROLES, dateFormat } from "@/config/consts"
import moment from "moment"
import { mapActions, mapGetters } from "vuex"
import ConfirmationModal from "@/components/ConfirmationModal.vue"

export default {
  name: "NegotiationPage",
  components: {
    ConfirmationModal, NegotiationPosts,
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
      isNegotiationLoaded: false,
      responseOptions: [],
      selectedItem: "",
      messageStatus: MESSAGE_STATUS,
      showNegotiationApprovalModal: false,
      showConfirmationModal: false,
      showPrivatePostModal: false,
      showLifecycleModal: false,
      privatePostResourceId: undefined,
      lifecycleResourceId: undefined,
      availableRoles: ROLES
    }
  },  
  computed: {
    organizations() {
      const organizationNames = []

      for (const request of this.negotiation.requests) {
        for (const resource of request.resources) {
          const organizationName = resource.id
          organizationNames.push(organizationName)
        }
      }
      return organizationNames
    },
    collections() {
      const collections = []

      for (const request of this.negotiation.requests) {
        for (const resource of request.resources) {
          const collection = resource.id
          collections.push(collection)
        }
      }
      return collections
    },
    numberOfCollections() {
      let counter = 0
      for (const request of this.negotiation.requests) {
        for (const resource of request.resources) {
          counter++
        }
      }
      return counter

    },
    resourcesIds() {
      const organizationNames = []

      for (const request of this.negotiation.requests) {
        for (const resource of request.resources) {
          const organizationName = resource.id
          organizationNames.push(organizationName)
        }
      }
      return organizationNames
    },
    authorName() {
      for (const person of this.negotiation.persons) {
        if (person.role === "RESEARCHER") {
          return person.name
        }
      }
      return ""
    },
  },
  watch: {
    negotiation(n) {
      if(n) {
        this.isNegotiationLoaded = n
      }
    }
  },
  async beforeMount() {
    this.negotiation = await this.retrieveNegotiationById({
      negotiationId: this.negotiationId,
    }) 
    this.loadPossibleEvents()
    this.roles = await this.retrieveUserRoles()
  },
  methods: {
    ...mapActions([
      "retrieveNegotiationById",
      "retrievePostsByNegotiationId",
      "retrieveUserRoles",
      "addMessageToNegotiation",
      "markMessageAsRead",
      "retrievePossibleEvents",
      "retrievePossibleEventsForResource",
      "updateNegotiationStatus",
      "updateResourceStatus",
      "downloadAttachment"
    ]),
    showConfirmationDialog() {
      this.showConfirmationModal = !this.showConfirmationModal
    },
    async isRepresentativeForResource(resourceId) {
      return !!this.roles.includes(resourceId)

    },
    getStatusForCollection(collectionId) {
      if (this.negotiation.resourceStatus && typeof this.negotiation.resourceStatus === "object") {
        return this.negotiation.resourceStatus[collectionId] || ""
      } else {
        return ""
      }
    },
    computed: {
      ...mapGetters(["oidcIsAuthenticated", "oidcUser"]),
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
      this.showNegotiationApprovalModal = false
    },
    async updateResource() {
      await this.updateResourceStatus({
        negotiationId: this.negotiation.id,
        resourceId: this.lifecycleResourceId,
        event: this.selectedItem,
      })
      this.showLifecycleModal = false
    },
    loadPossibleEventsForResource() {
      this.retrievePossibleEventsForResource({
        negotiationId: this.negotiation.id,
        resourceId: this.lifecycleResourceId
      }).then((data) => {
        this.responseOptions = data
      })
    },
    loadPossibleEvents() {
      this.retrievePossibleEvents({
        negotiationId: this.negotiation.id
      }).then((data) => {
        this.responseOptions = data
      })
    },
    interactPrivatePostModal(resourceId) {
      this.showPrivatePostModal = true
      this.privatePostResourceId = resourceId
    },
    interactLifecycleModal(resourceId) {
      this.showLifecycleModal = true
      this.lifecycleResourceId = resourceId
      this.loadPossibleEventsForResource()
    }
  },
}
</script>
<style scoped>
.modal {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.modal-title {
  font-size: large;
}
.list-group-item {
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-bottom: lightgray 1px solid;
}
.modal-content {
  background-color: "$light";
  margin: 15% auto;
  padding: 20px;
  border: 1px solid gray;
  width: 80%;
}
h1 {
  font-family: Calibri, Arial, sans-serif;
  color: rgb(233,87,19);
  font-weight: bolder;
  font-size: 60px;
}
.negotiation-list-table tbody tr:hover > td {
  cursor: pointer;
}
</style>