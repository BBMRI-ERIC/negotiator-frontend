<template>
  <button
    ref="openModal"
    hidden
    data-bs-toggle="modal"
    data-bs-target="#feedbackModal"
  />
  <confirmation-modal
    id="feedbackModal"
    :title="notificationTitle"
    :text="notificationText"
    dismiss-button-text="Back to HomePage"
    @dismiss="backToHomePage"
    @confirm="startNegotiation"
  />
  <div
    v-if="loading"
    class="d-flex align-items-center justify-content-center"
  >
    <h4 class="me-2">
      Loading...
    </h4>
    <div
      class="spinner-border"
      role="status"
    />
  </div>
  <div v-else>
    <div class="fs-3 mb-4 fw-bold text-secondary text-center">
      Access Form Submission
    </div>
    <form-wizard
      v-if="accessForm"
      :start-index="0"
      color="var(--bs-secondary)"
      step-size="md"
      @on-complete="startModal"
    >
      <tab-content
        title="Request summary"
        class="form-step border rounded-2 px-2 py-3 mb-2 overflow-auto"
      >
        <div class="mx-3">
          <div class="fs-5 fw-bold text-primary-text">
            SEARCH PARAMETERS
          </div>
          <div
            v-for="(qp, index) in queryParameters"
            :key="index"
            class="fs-6 text-dar text-secondary-text"
          >
            {{ qp }}
          </div>
        </div>
        <hr class="mx-3">
        <resources-list
          class="mx-3"
          :resources="resources"
        />
      </tab-content>
      <tab-content
        v-for="section in accessForm.sections"
        :key="section.name"
        :title="section.label"
        class="form-step border rounded-2 px-2 py-3 mb-2 overflow-auto text-primary-text"
        :before-change="isSectionValid(section)"
      >
        <div
          v-if="showStepFeedback"
          class="row"
        >
          <div class="col-12">
            <div
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              Please fill all the required fields
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
                @click="resetNotification"
              />
            </div>
          </div>
        </div>

        <div
          v-if="section.description"
          class="mx-3 d-flex justify-content-end"
        >
          <i
            class="py-1 bi bi-info-circle"
            data-bs-toggle="tooltip"
            :data-bs-title="section.description"
          />
        </div>

        <div
          v-for="criteria in section.elements"
          :key="criteria.name"
          class="mb-4 mx-3"
        >
          <label
            class="form-label text-primary-text"
            :class="{ required: criteria.required }"
          >
            {{ criteria.label }}
          </label>

          <textarea
            v-if="criteria.type === 'textarea'"
            v-model="negotiationCriteria[section.name][criteria.name]"
            :placeholder="criteria.description"
            class="form-control text-secondary-text"
            :required="criteria.required"
          />
          <input
            v-else-if="criteria.type === 'file'"
            accept=".pdf"
            class="form-control text-secondary-text"
            :required="criteria.required"
            :placeholder="criteria.description"
            :type="criteria.type"
            @change="handleFileUpload($event, section.name, criteria.name)"
          >
          <input
            v-else
            v-model="negotiationCriteria[section.name][criteria.name]"
            :type="criteria.type"
            :placeholder="criteria.description"
            class="form-control text-secondary-text"
            :required="criteria.required"
          >
        </div>
      </tab-content>
      <tab-content
        title="Overview"
        class="form-step overflow-auto"
      >
        <div
          class="border rounded-2 input-group p-3 mb-2 mb-3"
        >
          <span class="mb-3 fs-4 fw-bold text-secondary">Overview*</span>
          <span class="text-primary">Upon confirmation, your request will undergo content review. Our reviewers may contact you via email for further details. Upon approval, the respective biobanks you wish to contact will be notified of your request. Please click 'Submit request' and then 'Confirm' to proceed.</span>
        </div>
        <div
          v-for="section in accessForm.sections"
          :key="section.name"
          class="border rounded-2 input-group p-3 mb-2 mb-3 text-secondary-text"
        >
          <span class="mb-3 fs-4 fw-bold text-secondary">{{ section.label.toUpperCase() }}</span>
          <div
            v-for="accessFormElement in section.elements"
            :key="accessFormElement.name"
            class="input-group mb-2"
          >
            <label class="me-2 fw-bold">{{ accessFormElement.label }}:</label>
            <span v-if="isAttachment(negotiationCriteria[section.name][accessFormElement.name])">
              {{ negotiationCriteria[section.name][accessFormElement.name].name }}
            </span>
            <span v-else>
              {{ negotiationCriteria[section.name][accessFormElement.name] }}
            </span>
          </div>
        </div>
      </tab-content>
      <template #footer="props">
        <div class="wizard-footer-left">
          <button
            v-if="props.activeTabIndex > 0"
            type="button"
            class="btn btn-secondary"
            @click="props.prevTab()"
          >
            Previous
          </button>
        </div>
        <div class="wizard-footer-right">
          <button
            class="btn btn-secondary"
            @click="props.nextTab()"
          >
            {{ props.isLastStep ? "Submit request" : "Next" }}
          </button>
        </div>
      </template>
    </form-wizard>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue"
import { Tooltip } from "bootstrap"
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"
import ResourcesList from "@/components/ResourcesList.vue"
import { FormWizard, TabContent } from "vue3-form-wizard"
import "vue3-form-wizard/dist/style.css"
import { ROLES } from "@/config/consts"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const props = defineProps({
  requestId: {
    type: String,
    default: undefined
  }
})

const notificationTitle = ref("")
const notificationText = ref("")
const negotiationCriteria = ref({})
const accessForm = ref(undefined)
const resources = ref([])
const humanReadableSearchParameters = ref([])
const showStepFeedback = ref(false)
const roles = ref([])
const openModal = ref(null)

const isAdmin = computed(() => {
  return roles.value.includes(ROLES.ADMINISTRATOR)
})

const loading = computed(() => {
  return accessForm.value === undefined
})

const queryParameters = computed(() => {
  return humanReadableSearchParameters.value.split("\r\n")
})

onBeforeMount(async () => {
  const result = await store.dispatch("retrieveRequestById", { requestId: props.requestId })
  retrieveUserRoles()

  if (result.code) {
    if (result.code === 404) {
      showNotification("Error", "Request not found")
    } else {
      showNotification("Error", "Cannot contact the server to get request information")
    }
  } else if (result.negotiationId) {
    showNotification("Error", "Request already submitted")
  } else {
    resources.value = result.resources
    humanReadableSearchParameters.value = result.humanReadable
    accessForm.value = await store.dispatch("retrieveCombinedAccessForm", { requestId: props.requestId })
    if (accessForm.value !== undefined) {
      initNegotiationCriteria()
    }
  }
})

async function retrieveUserRoles () {
  await store.dispatch("retrieveUserRoles").then((res) => {
    roles.value = res
  })
}

onMounted(() => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']"
  })
})

function backToNegotiation (id) {
  router.push("/negotiations/" + id + "/ROLE_RESEARCHER")
}

async function startNegotiation () {
  const data = {
    requests: [props.requestId],
    payload: negotiationCriteria.value
  }
  await store.dispatch("createNegotiation", { data }).then((negotiationId) => {
    if (negotiationId) {
      backToNegotiation(negotiationId)
    }
  })
}

function startModal () {
  showNotification(
    "Confirm submission",
    "You will be redirected to the negotiation page where you can monitor the status. Click 'Confirm' to proceed."
  )
}
function isAttachment (value) {
  return value instanceof File || value instanceof Object
}

function handleFileUpload (event, section, criteria) {
  negotiationCriteria.value[section][criteria] = event.target.files[0]
}
function showNotification (header, body) {
  openModal.value.click()
  notificationTitle.value = header
  notificationText.value = body
}

function initNegotiationCriteria () {
  for (const section of accessForm.value.sections) {
    negotiationCriteria.value[section.name] = {}
    for (const criteria of section.elements) {
      negotiationCriteria.value[section.name][criteria.name] = null
    }
  }
}

function isSectionValid (section) {
  return () => {
    const valid = section.elements.every(ac => !ac.required || negotiationCriteria.value[section.name][ac.name])
    showStepFeedback.value = !valid
    return valid
  }
}

</script>

<style scoped>
.required:after {
  content: "  *\00a0";
  color: red;
}

.bi:hover {
  color: #7c7c7c;
}
</style>
