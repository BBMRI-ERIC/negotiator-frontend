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
        class="input-group mb-3"
      >
        <label class="me-2 fw-bold">{{ key }}:</label>
        <span> {{ element }}</span>
      </div>
    </div>
    <div v-if="negotiation && negotiation.postsEnabled">
      <h3>Send a message</h3>
      <form
        class="mb-4"
        @submit.prevent="addMessage"
      >
        <textarea
          v-model="message.text"
          class="form-control mb-3"
          style="min-width: 100%"
        />
        <button
          type="submit"
          class="btn btn-secondary float-end"
        >
          Send message
        </button>
      </form>
      <h3>Comments</h3>
      <div
        v-for="post in posts"
        :key="post.id"
        class="card mb-3"
      >
        <div class="card-header d-flex">
          <div class="me-auto">
            {{ post.poster.name }}
          </div>
          <div class="d-flex">
            <span
              v-if="
                post.status === messageStatus.SENT &&
                  post.poster_role != userRole
              "
              class="badge bg-primary rounded-pill"
            >
              New
            </span>
            <div class="ms-2">
              {{ printDate(post.creationDate) }}
            </div>
          </div>
        </div>
        <div class="card-body">
          {{ post.text }}
        </div>
      </div>
    </div>
    <div v-else>
      <h5>
        This negotiation has still to be approved. Wait for a biobanker approval
        before interacting with the counterpart.
      </h5>
    </div>
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
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { dateFormat, MESSAGE_STATUS, ROLES } from "@/config/consts"
import moment from "moment"

export default {
  name: "NegotiationPage",
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
    this.posts = await this.retrievePostsByNegotiationId({
      negotiationId: this.negotiationId,
    })

    // assign the role of the poster to each message belonging to negotiation
    let negotiation_persons = this.negotiation.persons
    for (let i = 0; i < negotiation_persons.length; i++) {
      for (let j = 0; j < this.posts.length; j++) {
        if (negotiation_persons[i].name == this.posts[j].poster.name) {
          this.posts[j].poster_role = negotiation_persons[i].role
        }
      }
    }

    this.posts.forEach((post) => {
      if (
        post.status == MESSAGE_STATUS.SENT &&
        post.poster_role != this.userRole
      ) {
        this.updateMessageStatus(post.id, post.text)
      }
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
    async addMessage() {
      // send a message and add the newly created post
      await this.addMessageToNegotiation({
        data: {
          resourceId: this.negotiation.requests[0].resources[0].id,
          text: this.message.text,
          negotiationId: this.negotiation.id,
        },
      }).then((post) => {
        if (post) {
          post.poster_role = this.userRole
          this.posts.push(post)
        }
      })
    },
    async updateMessageStatus(inputMessageId, inputMessageText) {
      await this.markMessageAsRead({
        data: {
          resourceId: this.negotiation.requests[0].resources[0].id,
          text: inputMessageText,
          negotiationId: this.negotiation.id,
          postId: inputMessageId,
          status: MESSAGE_STATUS.READ,
        },
      })
    },

    interactModal(negotiation) {
      this.showModal = true
      console.log(this.showModal)
      this.negotiation = negotiation
      console.log(negotiation)
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