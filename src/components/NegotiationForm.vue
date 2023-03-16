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
          <label v-if="criteria.required" class="form-label required"
            >{{ criteria.name }}
          </label>
          <label v-else class="form-label">{{ criteria.name }} </label>
          <textarea
            v-if="criteria.type === 'textarea'"
            v-model="negotiationCriteria[section.title][criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
          <input
            v-else
            :type="criteria.type"
            v-model="negotiationCriteria[section.title][criteria.name]"
            class="form-control"
            :required="criteria.required"
          />
        </div>
      </tab-content>
      <tab-content title="Overview">
        <div
          v-for="(criteria, section) in negotiationCriteria"
          :key="section"
          class="border input-group p-3 mb-3"
        >
          <span class="mb-4 fs-4 fw-bold text-secondary">{{ section }}:</span>
          <div
            v-for="(value, key) in criteria"
            :key="key"
            class="input-group mb-3"
          >
            <label class="me-2 fw-bold" :id="key">{{ key }}:</label>
            <span>{{ value }}</span>
          </div>
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
          <button @click="props.nextTab()" class="btn btn-primary">
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
      negotiationCriteria: {},
    };
  },
  computed: {
    ...mapGetters({
      accessCriteria: "getAccessCriteria",
      request: "getRequest",
    }),
    loading() {
      if (this.accessCriteria !== undefined) {
        this.initNegotiationCriteria();
      }
      return this.accessCriteria === undefined;
    },
  },
  methods: {
    ...mapActions(["retrieveAccessCriteriaByRequestId", "createNegotiation"]),
    async startNegotiation() {
      console.log(this.negotiationCriteria);
      for (let section in this.negotiationCriteria) {
        console.log(section);
      }
      //   const token = await this.$auth.getAccessToken();
      //   this.createNegotiation({
      //     data: this.negotiationCriteria,
      //     token: token,
      //   });
    },
    initNegotiationCriteria() {
      for (var section of this.accessCriteria.sections) {
        console.log(criteria);
        this.negotiationCriteria[section.title] = {};
        for (var criteria of section.accessCriteria) {
          console.log(criteria);
          this.negotiationCriteria[section.title][criteria.name] = null;
        }
      }
      console.log(this.negotiationCriteria);
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
  content: "  *\00a0";
  color: red;
}
</style>