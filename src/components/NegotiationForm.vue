<template>
  <div>Editing {{ requestId }}</div>
  <div
    v-for="criteria in accessCriteria"
    :key="criteria.name"
    class="mb-3 ms-3 me-3"
  >
    <label class="form-label">{{ criteria.name }} </label>
    <input type="{{ criteria.type }}" class="form-control" />
  </div>
  <div class="col-auto">
    <button
      type="submit"
      @click="createNegotiation"
      class="btn btn-primary mt-3 mb-3 ms-3 me-3"
    >
      Start Negotiation
    </button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "negotiation-form",
  props: {
    requestId: {
        type: String
    },
  },
  computed: {
    ...mapGetters({ accessCriteria: "getAccessCriteria" }),
  },
  methods: {
    ...mapActions(["retrieveAccessCriteria", "createNegotiation"]),
  },
  mounted() {
    this.retrieveAccessCriteria();
  },
};
</script>