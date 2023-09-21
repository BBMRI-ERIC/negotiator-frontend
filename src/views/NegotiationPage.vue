<template>
  <button
    type="button"
    class="btn btn-secondary"
    @click="
      $router.go(-1)
    "
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-arrow-left-square-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1z" />
    </svg>
    Go back
  </button>
  <div
    v-if="isNegotiationLoaded"
    style="margin-top: 20px"
  >
    <h1>
      {{ negotiation ? negotiation.payload.project.title.toUpperCase() : "" }}
    </h1>
    <hr class="mt-10 mb-10">
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
              <span> {{ subelement }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="col-4"
      >
        <ul class="list-group">
          <li class="list-group-item">
            <div class="fw-bold text-secondary">
              Creator:
            </div>
            <div>{{ creatorName }}</div>
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
            <span> {{ negotiation ? negotiation.status : "" }}</span>
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
        <p>
          <button
            class="btn btn-secondary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            <i class="bi bi-card-list" />
            Collections
          </button>
        </p>
        <div
          id="collapseExample"
          class="collapse"
        >
          <div class="card card-body">
            <ul>
              <li
                v-for="(element, key) in negotiation.resourceStatus"
                :key="element"
              >
                <div class="me-auto p-2">
                  <label class="me-2 fw-bold">{{ key }}</label>
                  <span> {{ element }}
                    <button
                      v-if="userRole === 'REPRESENTATIVE' && negotiation.status === 'ONGOING' && isRepresentativeForResource(key)"
                      class="btn btn-secondary btn-sm me-2 mb-1  float-end order-first"
                      @click.stop="interactLifecycleModal(key)"
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
      </div>
    </div>
    <NegotiationPosts
      class="col-8"
      :negotiation="negotiation"
      :user-role="userRole"
      scope="public"
    />
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
    v-if="showLifecycleModal"
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
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { dateFormat, MESSAGE_STATUS, ROLES } from "@/config/consts"
import moment from "moment"
import  NegotiationPosts  from "@/components/NegotiationPosts.vue"

export default {
  name: "NegotiationPage",
  components: { NegotiationPosts, 
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
      isNegotiationLoaded:false,
      responseOptions: [],
      selectedItem: "",
      messageStatus: MESSAGE_STATUS,
      showNegotiationApprovalModal: false,
      showModal: false,
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
    creatorName() {
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
    ]),
    capitalize(word) {
      const lower = word.toLowerCase()
      return word.charAt(0).toUpperCase() + lower.slice(1)
    },
    async isRepresentativeForResource(resourceId) {
      const roles = await this.retrieveUserRoles()
      return !!roles.includes(resourceId)

    },
    computed: {
      ...mapGetters(["oidcIsAuthenticated", "oidcUser"]),
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
    },
  },
}
</script>
<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
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