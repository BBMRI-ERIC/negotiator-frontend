<template>
  <div v-if="negotiation && negotiation.postsEnabled">
    <h5>Comments</h5>
    <div
      v-for="post in posts"
      :key="post.id"
      class="card mb-3"
    >
      <div class="card-header d-flex">
        <div class="me-auto">
          {{ post.createdBy.name }}
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
    <hr
      v-if="posts.length === 0"
      class="my-3"
    >
    <h5>Send a {{ scope }} message</h5>
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
      posts: [],
      message: {
        text: "",
        resourceId: undefined,
      },
      messageStatus: MESSAGE_STATUS
    }
  },
  
  async beforeMount() {
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
    resetForm() {
      this.message.text = ""
    },
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
      this.resetForm()
    }
  },
}
</script>
