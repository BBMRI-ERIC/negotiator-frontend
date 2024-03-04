<template>
  <div v-if="negotiation">
    <h5 class="text-primary">
      Comments
    </h5>
    <div
      v-for="post in posts"
      :key="post.id"
      class="card mb-3"
    >
      <div class="card-header d-flex">
        <div class="me-auto">
          <span
            class="badge rounded-pill bg-secondary"
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
    <h5 class="text-primary">
      Send a message
    </h5>
    <form
      class="border rounded mb-4 p-2"
      @submit.prevent="sendMessage"
    >
      <textarea
        v-model="message"
        class="form-control mb-3 text-primary"
      />
      <NegotiationAttachment
        v-if="attachment"
        class="ms-auto "
        :name="attachment.name"
        :content-type="attachment.type"
        :size="attachment.size"
        @removed="resetAttachment"
      />
      <div class="d-flex flex-row-reverse mt-3 mb-2">
        <span
          data-bs-toggle="tooltip"
          :data-bs-title="negotiation.postsEnabled ? '' : 'Messaging is unavailable until the request has been reviewed.' "
        >
          <button
            type="submit"
            :disabled="!readyToSend"
            class="btn btn-secondary ms-2"
          >
            Send message
          </button>
        </span>
        <button
          type="submit"
          class="btn btn-attachment ms-2 border rounded"
        >
          <input
            id="attachment"
            class="form-control"
            type="file"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            @change="showAttachment"
          >
          <i class="bi bi-paperclip" />
        </button>
        <select
          id="recipient"
          v-model="recipientId"
          class="form-select w-25 text-primary"
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
import { Tooltip } from "bootstrap"
import { mapActions, mapGetters } from "vuex"
import { dateFormat, MESSAGE_STATUS, POST_TYPE } from "@/config/consts"
import moment from "moment"
import NegotiationAttachment from "./NegotiationAttachment.vue"

export default {
  name: "NegotiationPosts",
  components: { NegotiationAttachment },
  props: {
    negotiation: {
      type: Object,
      default: undefined
    },
    userRole: {
      type: String,
      default: undefined
    },
    // Array of possible recipients for messages.
    recipients: {
      type: Array,
      default (rawProps) { // eslint-disable-line no-unused-vars
        return []
      }
    },
    organizations: {
      type: Object,
      default (rawProps) { // eslint-disable-line no-unused-vars
        return {}
      }
    }
  },
  data () {
    return {
      posts: [],
      message: "",
      recipientId: "",
      messageStatus: MESSAGE_STATUS,
      attachment: undefined
    }
  },
  computed: {
    ...mapGetters(["oidcUser"]),
    readyToSend () {
      return (this.message !== "" || this.attachment !== undefined) && this.recipientId !== "" && this.negotiation.postsEnabled
    },
    recipientsById () {
      return this.recipients.reduce((obj, item) => Object.assign(obj, { [item.id]: { name: item.name } }), {})
    }
  },
  mounted () {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']"
    })
  },
  async beforeMount () {
    this.posts = await this.retrievePostsByNegotiationId({
      negotiationId: this.negotiation.id
    })
  },
  methods: {
    ...mapActions([
      "retrievePostsByNegotiationId",
      "addMessageToNegotiation",
      "addAttachmentToNegotiation",
      "markMessageAsRead"
    ]),
    resetForm () {
      this.message = ""
      this.recipientId = ""
      this.resetAttachment()
    },
    resetAttachment () {
      this.attachment = undefined
    },
    printDate: function (date) {
      return moment(date).format(dateFormat)
    },
    showAttachment (event) {
      const file = event.target.files[0]
      this.attachment = file
    },
    async sendMessage () {
      if (!this.readyToSend) {
        return
      }
      if (this.attachment !== undefined) {
        await this.addAttachmentToNegotiation({
          data: {
            organizationId: this.recipientId !== "Everyone" ? this.recipientId : null,
            negotiationId: this.negotiation.id,
            attachment: this.attachment
          }
        }).then((attachment) => {
          console.log(`Successfully uploaded file: ${attachment.name}`)
        })
      } else {
        // send a message and add the newly created post
        await this.addMessageToNegotiation({
          data: {
            organizationId: this.recipientId !== "Everyone" ? this.recipientId : null,
            text: this.message,
            negotiationId: this.negotiation.id,
            type: this.recipientId === "Everyone" ? POST_TYPE.PUBLIC : POST_TYPE.PRIVATE
          }
        }).then((post) => {
          if (post) {
            this.posts.push(post)
          }
        })
      }
      this.resetForm()
    },
    transformId (id) {
      return id.replaceAll(":", "_")
    },
    getAuthorName (post) {
      if (post.createdBy.authSubject === this.oidcUser.sub) {
        return "You"
      } else {
        return `${post.createdBy.name}`
      }
    },
    getRecipientPostColor (post) {
      return post.type === POST_TYPE.PUBLIC ? { "bg-dark": true } : { "bg-primary": true }
    },
    getRecipientName (post) {
      if (post.organizationId !== undefined) {
        return this.organizations[post.organizationId].name
      } else if (post.personRecipient !== undefined) {
        return post.personRecipient.authSubject === this.oidcUser.sub ? "You" : post.personRecipient.name
      } else {
        return "Everyone"
      }
    },
    getHumanFileSize (bytes, dp = 1) {
      const thresh = 1024
      if (Math.abs(bytes) < thresh) {
        return bytes + " B"
      }
      const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      let u = -1
      const r = 10 ** dp
      do {
        bytes /= thresh
        ++u
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)
      return bytes.toFixed(dp) + " " + units[u]
    },
    getFileTypeIconClass (fileType) {
      if (fileType === "application/pdf") {
        return { "bi-file-pdf": true }
      } else if (["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(fileType)) {
        return { "bi-file-word": true }
      } else {
        return { "bi-file-earmark": true }
      }
    },
    getFileTypeName (fileType) {
      if (fileType === "application/pdf") {
        return "PDF"
      } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return "DOCX"
      } else if (fileType === "application/msword") {
        return "DOC"
      }
    }
  }
}
</script>

<style scoped>
/** the input file is hidden */
.btn-attachment input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
}
</style>
