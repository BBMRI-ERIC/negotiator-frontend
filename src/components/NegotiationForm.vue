<template>
  <div v-for="criteria in accessCriteria.accessCriteria" :key="criteria.name" class="mb-3 ms-3 me-3">
    <label class="form-label">{{ criteria.name }} </label>
    <input type="{{criteria.type}}" class="form-control" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "negotiation-form",
  computed: {
    ...mapGetters({ accessCriteria: "getAccessCriteria" }),
  },
  methods: {
    ...mapActions(["retrieveAccessCriteria"]),
  },
  mounted() {
    this.retrieveAccessCriteria();
    console.log(this.accessCriteria)
  },
};
</script>