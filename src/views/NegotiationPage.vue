<template>
  <div v-if="isNegotiationLoaded">
    <h4 class="mb-4">
      {{ negotiation ? negotiation.payload.project.title.toUpperCase() : "" }}
      <div class="dropdown float-end">
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
        <button
          type="button"
          class="btn btn-secondary"
          @click="
            $router.go(-1)
          "
        >
          Back to Negotiations List
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
    </h4>
    <hr class="mt-10 mb-10">
    <div
      class="input-group mb-3"
    >
      <label class="me-2 fw-bold">Negotiation ID:</label>
      <span> {{ negotiation ? negotiation.id : "" }}</span>
    </div>
    
    <hr class="mt-10 mb-10">

    <div
      v-for="(element, key) in negotiation.payload"
      :key="element"
      class="border input-group p-3 mb-3"
    >
      <span class="mb-3 fs-5 fw-bold text-secondary">
        {{ key.toUpperCase() }}</span>
      <div
        v-for="(subelement, subelementkey) in element"
        :key="subelement"
        class="input-group mb-3"
      >
        <label class="me-2 fw-bold">{{ subelementkey }}:</label>
        <span> {{ subelement }}</span>
      </div>
    </div>
    <div
      class="border input-group p-3 mb-3"
    >
      <span class="mb-3 fs-5 fw-bold text-secondary">
        RESOURCE STATUS</span>
      <div
        v-for="(element, key) in negotiation.resourceStatus"
        :key="element"
        class="input-group mb-3 d-flex"
      >
        <div class="me-auto p-2">
          <label class="me-2 fw-bold">{{ key }}:</label>
          <span> {{ element }}
          </span>
        </div>
        <div class="d-flex align-items-end flex-column">
          <button
            v-if="userRole === 'REPRESENTATIVE' && negotiation.status === 'ONGOING'"
            type="button"
            class="btn btn-secondary btn-sm me-2 mb-1 order-first"
            @click.stop="interactLifecycleModal(key)"
          >
            <font-awesome-icon
              icon="fa fa-pencil"
              fixed-width
            />
            Update State
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm me-2 mb-1 order-last"
            @click.stop="interactPrivatePostModal(key)"
          >
            <font-awesome-icon
              icon="fa fa-pencil"
              fixed-width
            />
            Private posts
          </button>
        </div>
      </div>
    </div>
    <NegotiationPosts 
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
    requestor() {
      return this.getRole(ROLES.RESEARCHER)
    },
    biobank() {
      return this.negotiation
        ? this.negotiation.requests[0].resources[0].id
        : ""
    },
    collections() {
      return this.negotiation
        ? this.negotiation.requests[0].resources[0].children
        : []
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
      "addMessageToNegotiation",
      "markMessageAsRead",
      "retrievePossibleEvents",
      "retrievePossibleEventsForResource",
      "updateNegotiationStatus",
      "updateResourceStatus",
    ]),
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
    getRole: function (role) {
      // check if the negotiation is already loaded from the backend
      if (this.negotiation === undefined) {
        return ""
      } else {
        // gets the first person with the required role
        const person = this.negotiation.persons.filter(
          (person) => person.role === role
        )[0]
        return person.name || ""
      }
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
    
    interactNegotiationApprovalModal(negotiation) {
      this.showNegotiationApprovalModal = true
      this.negotiation = negotiation
      this.loadPossibleEvents()
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
.modal-content {
  background-color: "$light";
  margin: 15% auto;
  padding: 20px;
  border: 1px solid gray;
  width: 80%;
}

.close {
  color: gray;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: "$black";
  text-decoration: none;
  cursor: pointer;
}
.negotiation-list-table tbody tr:hover > td {
  cursor: pointer;
}
</style>