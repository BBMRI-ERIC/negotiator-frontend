<template>
  <div>
    <h3>Negotation details page</h3>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <th scope="row">
            ID
          </th>
          <td>{{ negotiation.id }}</td>
          <th scope="row">
            Created By
          </th>
          <td>{{ negotiation.persons[0].name }}</td>
        </tr>
        <tr>
          <th scope="row">
            Status
          </th>
          <td>{{ negotiation.status }}</td>
          <th scope="row">
            Biobank
          </th>
          <td>{{ negotiation.requests[0].resources[0].id }}</td>
        </tr>
        <tr>
          <th scope="row">
            Project
          </th>
          <td>
            {{ negotiation.payload.project.title }} - {{ negotiation.payload.project.description }}
          </td>
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
    <h3>Negotiation messages list</h3>
    <ul
      v-for="post in posts"
      :key="post.text"
      class="list-group list-group-vertical "
    >
      <li
        class="list-group-item-dark"
        style="height: 30px; padding: 5px 15px;"
      >
        <p class="fst-italic fw-bold fs-6">
          At {{ post.creationDate }}, {{ post.poster.name }} from {{
            post.poster.organization }} wrote...
        </p>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        {{ post.text }}
        <div>
          <span
            v-if="post.status == 'CREATED' && post.poster_role != userRole"
            class="badge bg-primary rounded-pill"
          >New</span>
          <button
            v-if="post.status == 'CREATED' && post.poster_role != userRole"
            type="submit"
            class="btn btn-secondary btn-sm"
            @click="updateMessageStatus(post.id, post.text)"
          >
            Mark
            as read
          </button>
        </div>
      </li>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" />
        <li class="list-group-item" />
      </ul>
    </ul>
    <h3>Add a new message for the negotiation</h3>
    <form @submit="message">
      <textarea
        v-model="message.text"
        class="form-control"
        style="min-width: 100%"
      />
      <br>
      <div class="wizard-footer-right">
        <button
          type="submit"
          class="btn btn-secondary"
          @click="addMessage"
        >
          Add message
        </button>
      </div>
    </form>
  </div>
  <div v-else>
    <h5>
      This negotiation has still to be approved. Wait fot a biobanker approval before interacting with the
      counterpart.
    </h5>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

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