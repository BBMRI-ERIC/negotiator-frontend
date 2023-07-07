<template>
  <div v-if="loading" class="d-flex align-items-center justify-content-center">
    <h4>
      Loading
      <font-awesome-icon
        class="ms-2"
        icon="fa fa-spinner"
        spin-pulse
      ></font-awesome-icon>
    </h4>
  </div>
  <div v-else>
    <b-modal 
      id="negotiation-feedback"
      :title="notificationHeader"
      v-model="notificationVisible"
      hideFooter=true
      :headerBgVariant="notificationVariant"
      @hide.prevent>
      <p class="my-4">{{ notificationBody }}</p>
      <b-button @click="closeNegotiation">Back to Negotiations</b-button>
    </b-modal>
    <form-wizard
      @on-complete="startNegotiation"
      :start-index="0"
      color="var(--bs-secondary)"
      v-if="accessCriteria"
    >
      <tab-content
        v-for="section in accessCriteria.sections"
        :key="section.name"
        :title="section.label"
        class="form-step border rounded px-2 py-3 mb-2"
      >
        <div
          v-for="criteria in section.accessCriteria"
          :key="criteria.name"
          class="mb-4 ms-3 me-3"
        >
          <label class="form-label" :class="{ required: criteria.required }"
            >{{ criteria.label }}
          </label>
          <textarea
            v-if="criteria.type === 'textarea'"
            v-model="negotiationCriteria[section.name][criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
          <input
            v-else
            :type="criteria.type"
            v-model="negotiationCriteria[section.name][criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
        </div>
      </tab-content>
      <tab-content title="Overview">
        <div
          v-for="section in accessCriteria.sections"
          :key="section.name"
          class="border input-group p-3 mb-3"
        >
          <span class="mb-4 fs-4 fw-bold text-secondary">{{ section.label }}</span>
          <div
            v-for="criteria in section.accessCriteria"
            :key="criteria.name"
            class="input-group mb-3"
          >
            <label class="me-2 fw-bold">{{ criteria.label }}:</label>
            <span>{{ negotiationCriteria[section.name][criteria.name] }}</span>
          </div>
        </div>
      </tab-content>
      <template v-slot:footer="props">
        <div class="wizard-footer-left">
          <button
            v-if="props.activeTabIndex > 0"
            @click="props.prevTab()"
            type="button"
            class="btn btn-secondary"
          >
            Previous
          </button>
        </div>
        <div class="wizard-footer-right">
          <button @click="props.nextTab()" class="btn btn-secondary">
            {{ props.isLastStep ? "Start Negotiation" : "Next" }}
          </button>
        </div>
      </template>
    </form-wizard>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { FormWizard, TabContent } from "vue3-form-wizard";
import "vue3-form-wizard/dist/style.css";

export default {
  name: "negotiation-form",
  components: {
    FormWizard,
    TabContent,
  },
  props: {
    requestId: {
      type: String,
    },
  },
  data() {
    return {
        notificationVariant: "light",
        notificationHeader: "",
        notificationBody: "",
        negotiationCriteria: {},
        accessCriteria: undefined,
    };
  },
  computed: {
    notificationVisible() {
        return this.notificationHeader !== ""
    },
    loading() {
        if (this.accessCriteria !== undefined) {
            this.initNegotiationCriteria();
        }
        return this.accessCriteria === undefined && !this.notificationVisible;
    },
  },
  methods: {
    ...mapActions(["retrieveRequestById", "retrieveAccessCriteriaByResourceId", "createNegotiation"]),
    async startNegotiation() {
        await this.createNegotiation({
            data: {
                requests: [this.requestId],
                payload: this.negotiationCriteria
            }
        }).then((negotiationId) => {
            if (negotiationId) {
                this.showNotification("light", 
                    "Negotiation Created Correctly", 
                    "You can follow the status of this negotiation in your researcher page")
            } 
        });
    },
    showNotification(variant, header, body) {
        this.notificationVariant = variant
        this.notificationHeader = header
        this.notificationBody = body
    },
    closeNegotiation() {
        this.$router.push("/researcher");
    },
    initNegotiationCriteria() {
        for (var section of this.accessCriteria.sections) {
            this.negotiationCriteria[section.name] = {};
            for (var criteria of section.accessCriteria) {
                this.negotiationCriteria[section.name][criteria.name] = null;
            }
        }
    },
  },
  async mounted() {
    const result = await this.retrieveRequestById({
        requestId: this.requestId,
    })
    if (result.code) {        
        if (result.code == 404) {
            this.showNotification("danger", "Error", "Request not found")
        } else {
            this.showNotification("danger", "Error", "Error retrieving the request")
        }
    } else if (result.negotiationId) {    
        // if the negotiationId is present it means that the request is already associated to a negotiation
        this.showNotification("danger", "Error", "Request already associated to a negotiation")
    } else {
        await this.retrieveAccessCriteriaByResourceId({
            resourceId: result.resources[0].id
        }).then((accessCriteria) => {
            this.accessCriteria = accessCriteria
        });
    }
  },
};
</script>

<style scoped>
.required:after {
  content: "  *\00a0";
  color: red;
}

.form-step {
    height: 26rem;
    overflow-y: auto;
}
</style>