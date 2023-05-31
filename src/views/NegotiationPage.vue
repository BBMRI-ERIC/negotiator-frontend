<template>
  <div>
    <h4 class="mb-4">
      {{ negotiation.payload.project.title.toUpperCase() }}
    </h4>
    <div class="table-responsive-md">
      <table class="table table-bordered">
        <tbody>
          <tr>
            <th scope="row">
              Requestor
            </th>
            <td>{{ requestor }}</td>
            <th scope="row">
              Resource Manager
            </th>
            <td>{{ resourceManager }}</td>
          </tr>
          <tr>
            <th scope="row">
              Status
            </th>
            <td>{{ negotiation.status }}</td>
            <th scope="row">
              Description
            </th>
            <td>
              {{ negotiation.payload.project.title }} - {{ negotiation.payload.project.description }}
            </td>
          </tr>
          <tr>
            <th scope="row">
              Biobank
            </th>
            <td>{{ negotiation.requests[0].resources[0].id }}</td>
            <th scope="row">
              Collections
            </th>
            <td>
              <p
                v-for="i in negotiation.requests[0].resources[0].children"
                :key="i.id"
              >
                {{ i.id }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="negotiation.status == 'APPROVED'">
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
          <div>{{ printDate(post.creationDate) }}</div>
        </div>
        <div class="card-body">
          {{ post.text }}
        </div>
      </div>
      <h3>Send a message</h3>
      <form @submit="message">
        <textarea
          v-model="message.text"
          class="form-control mb-3"
          style="min-width: 100%"
        />
        <button
          type="submit"
          class="btn btn-secondary"
          @click="addMessage"
        >
          Send message
        </button>
      </form>
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
import { dateFormat, researcherRole, resourceManagerRole } from "../config/consts"
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
      posts: undefined,
      message: {
        text: "",
        resourceId: undefined
      }
    }
  },
  computed: {
    requestor() {
      return this.getRole(researcherRole)
    },
    resourceManager() {
      return this.getRole(resourceManagerRole)
    }
  },
  async created() {
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
      const person = this.negotiation.persons.filter(person => person.role === role)[0]
      return person.name || ""
    },
    async addMessage() {
      await this.addMessageToNegotiation({
        data: {
          resourceId: this.negotiation.requests[0].resources[0].id,
          text: this.message.text,
          negotiationId: this.negotiation.id
        }
      }).then((messageId) => {
        console.log("This is the new message ID:")
        this.$alert(messageId)
        if (messageId) {
          this.showNotification("light",
            "Message added correctly")
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
          status: "READ"
        }
      }).then((messageId) => {
        if (messageId) {
          window.location.reload()
        }
      })
    },
  }
}
</script>