<template>
  <div>
    <h4 class="mb-4">
      {{ negotiation ? negotiation.payload.project.title.toUpperCase() : "" }}
    </h4>
    <div class="table-responsive-md">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th scope="row">
              Requestor
            </th>
            <td colspan="4">{{ requestor }}</td>
            <!--th scope="row">
              Resource Manager
            </th>
            <td>ND</td-->
          </tr>
          <tr>
            <th scope="row">
              Status
            </th>
            <td>{{ negotiation ? negotiation.status : "" }}</td>
            <th scope="row">
              Description
            </th>
            <td>
              {{ negotiation ? negotiation.payload.project.description : "" }}
            </td>
          </tr>
          <tr>
            <th scope="row">
              Biobank
            </th>
            <td>{{ biobank }}</td>
            <th scope="row">
              Collections
            </th>
            <td>
              <span
                v-for="i in collections"
                :key="i.id"
              >
                {{ i.id }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
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
          class="btn btn-secondary"
        >
          Send message
        </button>
      </form>
      <h3>Conversation</h3>
      <div
        v-for="post in posts"
        :key="post.id" 
        class="card mb-3"
      >
        <div class="card-header d-flex">
          <div class="me-auto">
            {{ post.poster.name }} ({{ post.poster.organization }})
          </div>
          <div class="d-flex">
            <span
              v-if="post.status === messageStatus.SENT && post.poster_role != userRole"
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
        This negotiation has still to be approved. Wait fot a biobanker approval before interacting with the
        counterpart.
      </h5>
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
      default: undefined
    },
    userRole: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      negotiation: undefined,
      posts: [],
      message: {
        text: "",
        resourceId: undefined
      },
      messageStatus: MESSAGE_STATUS
    }
  },
  computed: {
    requestor() {
      return this.getRole(ROLES.RESEARCHER)
    },
    biobank() {
      return this.negotiation ? this.negotiation.requests[0].resources[0].id : ""
    },
    collections() {
      return this.negotiation ? this.negotiation.requests[0].resources[0].children : []
    }
  },
  async beforeMount() {
    this.negotiation = await this.retrieveNegotiationById({ negotiationId: this.negotiationId })
    this.posts = await this.retrievePostsByNegotiationId({ negotiationId: this.negotiationId })
    
    // assign the role of the poster to each message belonging to negotiation
    let negotiation_persons = this.negotiation.persons
    for (let i = 0; i < negotiation_persons.length; i++) {
      for (let j = 0; j < this.posts.length; j++) {
        if (negotiation_persons[i].name == this.posts[j].poster.name) {
          this.posts[j].poster_role = negotiation_persons[i].role
        }
      }
    }
    
    this.posts.forEach(post => {
      if (post.status == MESSAGE_STATUS.SENT && post.poster_role != this.userRole) {
        this.updateMessageStatus(post.id, post.text)
      }
    })
  },
  methods: {
    ...mapActions(["retrieveNegotiationById", "retrievePostsByNegotiationId", "addMessageToNegotiation", "markMessageAsRead"]),
    computed: {
      ...mapGetters(["oidcIsAuthenticated", "oidcUser"])
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
        const person = this.negotiation.persons.filter(person => person.role === role)[0]
        return person.name || ""
      }
    },
    async addMessage() {
      // send a message and add the newly created post 
      await this.addMessageToNegotiation({
        data: {
          resourceId: this.negotiation.requests[0].resources[0].id,
          text: this.message.text,
          negotiationId: this.negotiation.id
        }
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
          status: MESSAGE_STATUS.READ
        }
      })
    },
  }
}
</script>