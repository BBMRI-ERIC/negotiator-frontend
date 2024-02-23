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
    <div class="fs-3 mb-4 fw-bold text-secondary text-center"> Access Form Submission</div>
    <form-wizard
      v-if="accessCriteria"
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
        v-for="section in accessCriteria.sections"
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
  
        <div v-if="section.description" class="mx-3 d-flex justify-content-end">
          <i  class="py-1 bi bi-info-circle" data-bs-toggle="tooltip" :data-bs-title="section.description"></i>
        </div>
        
        <div
          v-for="criteria in section.accessCriteria"
          :key="criteria.name"
          class="mb-4 mx-3"
        >
          <label class="form-label text-primary-text" :class="{ required: criteria.required }"> 
            {{ criteria.label }}
          </label> 

          <i v-if="criteria.description" class="mx-2 py-1 bi bi-info-circle" data-bs-toggle="tooltip" :data-bs-title="criteria.description"></i>

          <textarea
            v-if="criteria.type === 'textarea'"
            v-model="negotiationCriteria[section.name][criteria.name]"
            class="form-control text-secondary-text"
            :required="criteria.required"
          />
          <input
            v-else-if="criteria.type === 'file'"
            accept=".pdf"
            class="form-control text-secondary-text"
            :required="criteria.required"
            :type="criteria.type"
            @change="handleFileUpload($event, section.name, criteria.name)"
          >
          <input
            v-else
            v-model="negotiationCriteria[section.name][criteria.name]"
            :type="criteria.type"
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
          v-for="section in accessCriteria.sections"
          :key="section.name"
          class="border rounded-2 input-group p-3 mb-2 mb-3 text-secondary-text"
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

<script>
import { Tooltip } from 'bootstrap'
import ConfirmationModal from "@/components/modals/ConfirmationModal.vue"
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
    ConfirmationModal,
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
        resourceId: result.resources[0].id
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
    backToNegotiation(id) {
      this.$router.push("/negotiations/"+ id + "/ROLE_RESEARCHER")
    },
    async startNegotiation() {
      await this.createNegotiation({
        data: {
          requests: [this.requestId],
          payload: this.negotiationCriteria,
        }
      }).then((negotiationId) => {
        if(negotiationId){
          this.backToNegotiation(negotiationId)
        }
      })
    },
    async startModal() {
          this.showNotification(
            "Confirm submission",
            "You will be redirected to the negotiation page where you can monitor the status. Click 'Confirm' to proceed.")
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