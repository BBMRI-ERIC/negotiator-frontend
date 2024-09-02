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
    <div
      v-if="showMessageRecipientInfo"
      class="text-muted"
    >
      <i class="bi bi-exclamation-diamond" />
      This message will be visible to the request Author, representatives and the Administrator
    </div>
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
          :title="negotiation.privatePostsEnabled ? '' : 'Messaging is unavailable until the request has been reviewed.' "
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
          <optgroup :label="privatePostsGroupLabel">
            <option
              v-for="recipient in recipients"
              :key="recipient.id"
              :value="recipient.id"
              :disabled="!negotiation.privatePostsEnabled"
            >
              {{ recipient.name }}
            </option>
          </optgroup>
        </select>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed, watch } from "vue"
import { Tooltip } from "bootstrap"
import { dateFormat, POST_TYPE } from "@/config/consts"
import moment from "moment"
import NegotiationAttachment from "./NegotiationAttachment.vue"
import { useOidcStore } from "../store/oidc"
import { useNegotiationPageStore } from '../store/negotiationPage.js'

const oidcStore = useOidcStore()
const negotiationPageStore = useNegotiationPageStore()

const props = defineProps({
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
})
const posts = ref([])
const message = ref("")
const recipientId = ref("")
const attachment = ref(undefined)

const oidcUser = computed(() => {
  return oidcStore.oidcUser
})

const readyToSend = computed(() => {
  return (message.value !== "" || attachment.value !== undefined) && recipientId.value !== "" &&
  (props.negotiation.publicPostsEnabled || props.negotiation.privatePostsEnabled)
})

const recipientsById = computed(() => {
  return props.recipients.reduce((obj, item) => Object.assign(obj, { [item.id]: { name: item.name } }), {})
})

const privatePostsGroupLabel = computed(() => {
  if (props.negotiation.privatePostsEnabled) {
    return "Private messages"
  }
  return "Private messages will be enabled after an administrator will approve the negotiation"
})
const showMessageRecipientInfo = ref(false)
watch(recipientId, (newValue, oldValue) => {
  if (newValue === "Everyone") {
    showMessageRecipientInfo.value = true
  } else {
    showMessageRecipientInfo.value = false
  }
  console.log("recipientId changed from", oldValue, "to", newValue)
})
onMounted(() => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']"
  })
})

onBeforeMount(() => {
  retrievePostsByNegotiationId()
})

async function retrievePostsByNegotiationId () {
  await negotiationPageStore.retrievePostsByNegotiationId(props.negotiation.id).then((res) => {
    posts.value = res
  })
}

async function addMessageToNegotiation () {
  const data = {
    organizationId: recipientId.value !== "Everyone" ? recipientId.value : null,
    text: message.value,
    negotiationId: props.negotiation.id,
    type: recipientId.value === "Everyone" ? POST_TYPE.PUBLIC : POST_TYPE.PRIVATE
  }
  await negotiationPageStore.addMessageToNegotiation(data).then((post) => {
    if (post) {
      posts.value.push(post)
    }
  })
}

async function addAttachmentToNegotiation () {
  const data = {
    organizationId: recipientId.value !== "Everyone" ? recipientId.value : null,
    negotiationId: props.negotiation.id,
    attachment: attachment.value
  }
  await negotiationPageStore.addAttachmentToNegotiation(data).then((post) => {
    if (attachment.value) {
      console.log(`Successfully uploaded file: ${attachment.value.name}`)
    }
  })
  emit("new_attachment")
}

function resetForm () {
  message.value = ""
  recipientId.value = ""
  resetAttachment()
}

function resetAttachment () {
  attachment.value = undefined
}
function printDate (date) {
  return moment(date).format(dateFormat)
}
function showAttachment (event) {
  const file = event.target.files[0]
  attachment.value = file
}

async function sendMessage () {
  if (!readyToSend.value) {
    return
  }
  if (attachment.value !== undefined) {
    // send attachment
    await addAttachmentToNegotiation()
  }
  if (message.value !== "") {
    // send a message and add the newly created post
    await addMessageToNegotiation()
  }
  resetForm()
}

function transformId (id) {
  return id.replaceAll(":", "_")
}

function getAuthorName (post) {
  if (post.createdBy.authSubject === oidcUser.value.sub) {
    return "You"
  } else {
    return `${post.createdBy.name}`
  }
}

function getRecipientPostColor (post) {
  return post.type === POST_TYPE.PUBLIC ? { "bg-dark": true } : { "bg-primary": true }
}

function getRecipientName (post) {
  if (post.organizationId !== undefined) {
    return props.organizations[post.organizationId].name
  } else if (post.personRecipient !== undefined) {
    return post.personRecipient.authSubject === oidcUser.value.sub ? "You" : post.personRecipient.name
  } else {
    return "Everyone"
  }
}

function getHumanFileSize (bytes, dp = 1) {
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
}

function getFileTypeIconClass (fileType) {
  if (fileType === "application/pdf") {
    return { "bi-file-pdf": true }
  } else if (["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"].includes(fileType)) {
    return { "bi-file-word": true }
  } else {
    return { "bi-file-earmark": true }
  }
}

function getFileTypeName (fileType) {
  if (fileType === "application/pdf") {
    return "PDF"
  } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return "DOCX"
  } else if (fileType === "application/msword") {
    return "DOC"
  }
}
const emit = defineEmits(["new_attachment"])
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
.bi-exclamation-diamond{
  color: orange;
}
</style>
