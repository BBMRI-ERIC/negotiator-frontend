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
    <div
      v-for="criteria in accessCriteria"
      :key="criteria.name"
      class="mb-3 ms-3 me-3"
    >
      <label class="form-label">{{ criteria.name }} </label>
      <input
        :type="criteria.type"
        v-model="negotiationCriteria[criteria.name]"
        class="form-control"
      />
    </div>
    <div class="col-auto">
      <button
        type="submit"
        @click="startNegotiation"
        class="btn btn-primary mt-3 mb-3 ms-3 me-3"
      >
        Start Negotiation
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "negotiation-form",
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
    ...mapGetters({ accessCriteria: "getAccessCriteria" }),
    loading() {
      return this.accessCriteria === {};
    },
  },
  methods: {
    ...mapActions(["retrieveAccessCriteria", "createNegotiation"]),
    startNegotiation() {
      this.$auth.getAccessToken().then((token) => {
        this.createNegotiation({
          data: this.negotiationCriteria,
          token: token,
        });
      });
    },
  },
  mounted() {
    this.$auth.getAccessToken().then((token) => {
      this.retrieveAccessCriteria(token);
    });
  },
};
</script>