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
          <span
            class="badge rounded-pill"
            :class="getAuthorPostColor(post)"
          >
            {{ getAuthorName(post) }}
          </span> to
          <span
            class="badge rounded-pill"
            :class="getRecipientPostColor(post)"
          >{{ getRecipientName(post) }}</span>
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
    <h5>Send a message</h5>
    <form
      class="mb-4"
      @submit.prevent="sendMessage"
    >
      <textarea
        v-model="message"
        class="form-control mb-3"
      />
      <div class="d-flex flex-row-reverse">
        <button
          type="submit"
          :disabled="!readyToSend"
          class="btn btn-secondary ms-2"
        >
          Send message
        </button>
        <select
          id="recipient"
          v-model="recipientId"
          class="form-select w-25"
        >
          <option
            disabled
            selected
            value=""
          >
            -- Select recipient --
          </option>
          <option value="Everyone">
            Everyone
          </option>
          <option 
            v-for="recipient in recipients"
            :key="recipient.id"
            :value="recipient.id"
          >
            {{ recipient.name }}
          </option>
        </select>
      </div>
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
    recipients: {
      type: Array,
      default(rawProps) { // eslint-disable-line no-unused-vars
        return []
      }
    },
    organizations: {
      type: Array,
      default(rawProps) { // eslint-disable-line no-unused-vars
        return []
      }
    }

  },
  data() {
    return {
      posts: [],
      message: "",
      recipientId: null,
      messageStatus: MESSAGE_STATUS,
    }
  },
  computed: {
    ...mapGetters(["oidcUser"]),
    readyToSend() {
      return this.message !== "" && this.recipientId !== ""
    },
    recipientsById() {
      return this.recipients.reduce(
        (obj, item) => Object.assign(obj, { [item.id]: { name: item.name, type: item.type } }), {})
    },
    organizationsById() { 
      return this.organizations.reduce(
        (obj, item) => Object.assign(obj, { [item.externalId]: { name: item.name } }), {})    
    }
  },  
  async beforeMount() {
    this.posts = await this.retrievePostsByNegotiationId({
      negotiationId: this.negotiation.id
    })
  },    
  methods: {
    ...mapActions([
      "retrievePostsByNegotiationId",
      "addMessageToNegotiation",
      "markMessageAsRead",
    ]),
    resetForm() {
      this.message = ""
      this.recipientId = ""
    },
    printDate: function (date) {
      return moment(date).format(dateFormat)
    },
    async sendMessage() {
      if (!this.readyToSend) {
        return
      }
    
      // send a message and add the newly created post
      await this.addMessageToNegotiation({
        data: {
          organizationId: this.recipientId != "Everyone" ? this.recipientId : null,
          text: this.message,
          negotiationId: this.negotiation.id,
          type: this.recipientId === "Everyone" ? "PUBLIC" : "PRIVATE"          
        },
      }).then((post) => {
        if (post) {
          this.posts.push(post)
        }
      })
      this.resetForm()
    },
    transformId(id) {
      return id.replaceAll(":", "_")
    },
    getAuthorPostColor(post) {
      if (post.createdBy.authSubject === this.oidcUser.sub) {
        return {
          "bg-secondary": true
        }
      }
      else {
        return {
          "bg-primary": true
        }
      }
    },
    getAuthorName(post) {
      return post.createdBy.authSubject === this.oidcUser.sub ? "You" : post.createdBy.name
    },
    getRecipientPostColor(post) {
      if (post.type === "PUBLIC") {
        return {
          "bg-info": true
        }
      }
      else if (post.personRecipient !== undefined && post.personRecipient.authSubject === this.oidcUser.sub) {        
        return {
          "bg-secondary": true
        }
      } else {
        return {
          "bg-primary": true
        }
      }
    },
    getRecipientName(post) {
      if (post.organizationId !== undefined) {
        return this.organizationsById[post.organizationId].name
      } else if (post.personRecipient !== undefined) {
        return post.personRecipient.authSubject === this.oidcUser.sub ? "You" : post.personRecipient.name
      } else {
        return "Everyone"
      }
    }
  }
}
</script>
