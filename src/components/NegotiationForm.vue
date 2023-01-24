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
    <form-wizard
      @on-complete="startNegotiation"
      :start-index="0"
      color="var(--bs-secondary)"
    >
      <tab-content
        v-for="section in accessCriteria.sections"
        :key="section.id"
        :title="section.title"
      >
        <div
          v-for="criteria in section.accessCriteria"
          :key="criteria.name"
          class="mb-4 ms-3 me-3"
        >
          <label v-if="criteria.required" class="form-label required">{{ criteria.name }} </label>
          <label v-else class="form-label">{{ criteria.name }} </label>
          <textarea v-if="criteria.type === 'textarea'"
            v-model="negotiationCriteria[criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
          <input v-else
            :type="criteria.type"
            v-model="negotiationCriteria[criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
        </div>
      </tab-content>
      <template v-slot:footer="props">
        <div class="wizard-footer-left">
          <button
            v-if="props.activeTabIndex > 0"
            @click="props.prevTab()"
            type="button"
            class="btn btn-primary"
          >
            Previous
          </button>
        </div>
        <div class="wizard-footer-right">
          <button
            v-if="!props.isLastStep"
            @click="props.nextTab()"
            class="btn btn-primary"
          >
            Next
          </button>
          <button v-else @click="alert('Done')" class="btn btn-primary">
            {{ props.isLastStep ? "Start Negotiation" : "Next" }}
          </button>
        </div>
      </template>
    </form-wizard>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
      negotiationCriteria: {
        title: "",
        description: "",
        ethicsVote: "",
        queries: [this.requestId],
      },
    };
  },
  computed: {
    ...mapGetters({
      accessCriteria: "getAccessCriteria",
      request: "getRequest",
    }),
    loading() {
      console.log(this.accessCriteria);
      return this.accessCriteria === undefined;
    },
  },
  methods: {
    ...mapActions(["retrieveAccessCriteriaByRequestId", "createNegotiation"]),
    async startNegotiation() {
      const token = await this.$auth.getAccessToken();
      this.createNegotiation({
        data: this.negotiationCriteria,
        token: token,
      });
    },
  },
  async mounted() {
    const token = await this.$auth.getAccessToken();
    this.retrieveAccessCriteriaByRequestId({
      token,
      requestId: this.requestId,
    });
  },
};
</script>

<style scoped>
.wizard-icon-container {
  background-color: "blue" !important;
}

.required:after {
    content:"  *\00a0";
    color:red;
}
</style>