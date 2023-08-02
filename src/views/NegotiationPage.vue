<template>
  <div>
    <h4 class="mb-4">
      {{ negotiation ? negotiation.payload.project.title.toUpperCase() : "" }}
      <button
        type="button"
        class="btn btn-secondary float-end"
        @click.stop="interactModal(negotiation)"
      >
        Update negotiation
      </button>
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
            type="button"
            class="btn btn-secondary btn-sm me-2 mb-1"
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
    v-if="showModal"
    class="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">
            This is the modal window title
          </h1>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            @click="showModal = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="showPrivatePostModal"
    class="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">
            This is the private posts modal window title for {{ privatePostResourceId }}
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
      messageStatus: MESSAGE_STATUS,
      showModal: false,
      showPrivatePostModal: false,
      privatePostResourceId: undefined
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
  async beforeMount() {
    this.negotiation = await this.retrieveNegotiationById({
      negotiationId: this.negotiationId,
    }) 
  },
  methods: {
    ...mapActions([
      "retrieveNegotiationById",
      "retrievePostsByNegotiationId",
      "addMessageToNegotiation",
      "markMessageAsRead",
    ]),
    computed: {
      ...mapGetters(["oidcIsAuthenticated", "oidcUser"]),
    },
    printDate: function (date) {
      return moment(date).format(dateFormat)
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
    
    interactModal(negotiation) {
      this.showModal = true
      this.negotiation = negotiation
    },

    interactPrivatePostModal(resourceId) {
      this.showPrivatePostModal = true
      this.privatePostResourceId = resourceId
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