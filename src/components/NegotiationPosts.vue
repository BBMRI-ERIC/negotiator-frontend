<template>
  <div v-if="negotiation && negotiation.postsEnabled">
    <h3>Send a {{ scope }} message</h3>
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
</template>

<script>
import { mapActions, mapGetters } from "vuex"
import { dateFormat, MESSAGE_STATUS } from "@/config/consts"
import moment from "moment"

export default {
  name: "NegotiationPosts",
  props: {
    negotiation: {
      type: Object,
      default: undefined,
    },
    userRole: {
      type: String,
      default: undefined,
    },
    scope: {
      type: String,
      default: undefined,
    },
    resourceId: {
      type: String,
      default: null,
    },

  },
  data() {
    return {
      // negotiation: undefined,
      posts: [],
      message: {
        text: "",
        resourceId: undefined,
      },
      messageStatus: MESSAGE_STATUS
    }
  },
  
  async beforeMount() {
    console.log(this.scope.toUpperCase())
    this.posts = await this.retrievePostsByNegotiationId({
      negotiationId: this.negotiation.id,
      type: this.scope.toUpperCase(),
      resourceId: this.resourceId
    })
  },
  methods: {
    ...mapActions([
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
          resourceId: this.resourceId,
          text: this.message.text,
          negotiationId: this.negotiation.id,
          type: this.scope.toUpperCase()
          
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
          resourceId: this.resourceId,
          text: inputMessageText,
          negotiationId: this.negotiation.id,
          postId: inputMessageId,
          status: MESSAGE_STATUS.READ,
          type: this.scope.toUpperCase()
        },
      })
    },
  },
}
</script>
