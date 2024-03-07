<template>
  <button
    ref="openModal"
    hidden
    data-bs-toggle="modal"
    data-bs-target="#feedbackModal"
  />
  <feedback-modal
    id="feedbackModal"
    :title="notificationTitle"
    :text="notificationText"
    dismiss-button-text="Back to HomePage"
    @dismiss="backToHomePage"
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
    <form-wizard
      v-if="accessCriteria"
      :start-index="0"
      color="var(--bs-secondary)"
      step-size="md"
      @on-complete="startNegotiation"
    >
      <tab-content
        title="Request summary"
        class="form-step border rounded-2 px-2 py-3 mb-2 overflow-auto"
      >
        <div class="mx-3">
          <div class="fs-5 fw-bold text-secondary">
            SEARCH PARAMETERS
          </div>
          <div
            v-for="(qp, index) in queryParameters"
            :key="index" 
            class="fs-6 text-dar"
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
        v-for="section in accessCriteria.sections"
        :key="section.name"
        :title="section.label"
        class="form-step border rounded-2 px-2 py-3 mb-2 overflow-auto"
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
  
        <div v-if="section.description" class="mx-3 d-flex justify-content-end">
          <i  class="py-1 bi bi-info-circle" data-bs-toggle="tooltip" :data-bs-title="section.description"></i>
        </div>
        
        <div
          v-for="criteria in section.accessCriteria"
          :key="criteria.name"
          class="mb-4 mx-3"
        >
          <label class="form-label" :class="{ required: criteria.required }"> 
            {{ criteria.label }}
          </label> 

          <i v-if="criteria.description" class="mx-2 py-1 bi bi-info-circle" data-bs-toggle="tooltip" :data-bs-title="criteria.description"></i>

          <textarea
            v-if="criteria.type === 'textarea'"
            v-model="negotiationCriteria[section.name][criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
          <input
            v-else-if="criteria.type === 'file'"
            accept=".pdf"
            class="form-control"
            :required="criteria.required"
            :type="criteria.type"
            @change="handleFileUpload($event, section.name, criteria.name)"
          >
          <input
            v-else
            v-model="negotiationCriteria[section.name][criteria.name]"
            :type="criteria.type"
            class="form-control"
            :required="criteria.required"
          >
        </div>
      </tab-content>
      <tab-content
        title="Overview"
        class="form-step overflow-auto"
      >
        <div
          v-for="section in accessCriteria.sections"
          :key="section.name"
          class="border rounded-2 input-group p-3 mb-2 mb-3"
        >
          <span class="mb-3 fs-4 fw-bold text-secondary">{{ section.label.toUpperCase() }}</span>
          <div
            v-for="criteria in section.accessCriteria"
            :key="criteria.name"
            class="input-group mb-2"
          >
            <label class="me-2 fw-bold">{{ criteria.label }}:</label>
            <span v-if="isAttachment(negotiationCriteria[section.name][criteria.name])">
              {{ negotiationCriteria[section.name][criteria.name].name }}
            </span>
            <span v-else>
              {{ negotiationCriteria[section.name][criteria.name] }}
            </span>
          </div>
        </div>
      </tab-content>
      <template #footer="props">
        <div v-if="props.isLastStep && isAdmin" class="form-check mb-3 d-flex justify-content-end">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
          <label class="form-check-label ps-2" for="flexCheckDefault">
             <p class="m-0">Mark as test request</p> 
          </label>
        </div>
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
            {{ props.isLastStep ? "Start Negotiation" : "Next" }}
          </button>
        </div>
      </template>
    </form-wizard>
  </div>
</template>

<script>
import { Tooltip } from 'bootstrap'
import FeedbackModal from "@/components/modals/FeedbackModal.vue"
import ResourcesList from "@/components/ResourcesList.vue"
import { FormWizard, TabContent } from "vue3-form-wizard"
import "vue3-form-wizard/dist/style.css"
import { mapActions } from "vuex"
import { ROLES } from "@/config/consts"

export default {
  name: "NegotiationForm",
  components: {
    FormWizard,
    TabContent,
    FeedbackModal,
    ResourcesList
  },
  props: {
    requestId: {
      type: String,
      default: undefined
    },
  },
  data() {
    return {
      notificationTitle: "",
      notificationText: "",
      negotiationCriteria: {},
      accessCriteria: undefined,
      resources: [],
      humanReadableSearchParameters: [],
      showStepFeedback: false,
      roles: []
    }
  },
  computed: {
    isAdmin() {
      return this.roles.includes(ROLES.ADMINISTRATOR)
    },
    loading() {
      return this.accessCriteria === undefined
    },
    queryParameters() {
      return this.humanReadableSearchParameters.split("\r\n")
    }
  },
  async beforeMount() {
    const result = await this.retrieveRequestById({
      requestId: this.requestId,
    })

    this.roles = await this.retrieveUserRoles()

    if (result.code) {        
      if (result.code == 404) {
        this.showNotification("Error", "Request not found")
      } else {
        this.showNotification("Error", "Cannot contact the server to get request information")
      }
    } else if (result.negotiationId) {    
      this.showNotification("Error", "Request already submitted")
    } else {
      this.resources = result.resources
      this.humanReadableSearchParameters = result.humanReadable
      this.accessCriteria = await this.retrieveAccessCriteriaByResourceId({
        resourceId: result.resources[0].externalId
      })
      if (this.accessCriteria !== undefined) {
        this.initNegotiationCriteria()
      }
    }
  },
  mounted () {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    })
  },
  methods: {
    ...mapActions(["retrieveUserRoles", "retrieveRequestById", "retrieveAccessCriteriaByResourceId", "createNegotiation"]),
    async startNegotiation() {
      await this.createNegotiation({
        data: {
          requests: [this.requestId],
          payload: this.negotiationCriteria,
        }
      }).then((negotiationId) => {
        if (negotiationId) {
          this.showNotification(
            "Request submitted correctly", 
            "You can follow the status of this negotiation in your researcher page")
        } 
      })
    },
    isAttachment(value) {
      return value instanceof File || value instanceof Object
    },
    handleFileUpload(event, section, criteria) {
      this.negotiationCriteria[section][criteria] = event.target.files[0]
    },
    showNotification(header, body) {
      this.$refs.openModal.click()
      this.notificationTitle = header
      this.notificationText = body
    },
    backToHomePage() {
      this.$router.push("/")
    },
    initNegotiationCriteria() {
      for (var section of this.accessCriteria.sections) {
        this.negotiationCriteria[section.name] = {}
        for (var criteria of section.accessCriteria) {
          this.negotiationCriteria[section.name][criteria.name] = null
        }
      }
    },
    getElementIdFromResourceId(collection) {
      return collection.replaceAll(":", "_")
    },
    isSectionValid(section) {
      return () => {
        const valid = section.accessCriteria.every(ac => !ac.required || this.negotiationCriteria[section.name][ac.name])
        this.showStepFeedback = !valid
        return valid
      }
    }
  },
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