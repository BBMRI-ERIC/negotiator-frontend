<template>
  <div
    v-for="criteria in accessCriteria"
    :key="criteria.name"
    class="mb-4 ms-3 me-3"
  >
    <label
      v-if="criteria.required"
      class="form-label required"
    >{{ criteria.name }}
    </label>
    <label
      v-else
      class="form-label"
    >{{ criteria.name }} </label>
    <textarea
      v-if="criteria.type === 'textarea'"
      class="form-control"
      :required="criteria.required"
    />
    <input
      v-else
      :type="criteria.type"
      class="form-control"
      :required="criteria.required"
    >
  </div>
</template>

<script>
export default {
  name: "AccessCriteriaSection",
  props: {
    accessCriteria: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
