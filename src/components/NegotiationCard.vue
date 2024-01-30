<template>
  <div class="px-0 px-md-1">
  <div class="card mb-2 px-0">
    <h5 class="card-header bg-body">
      {{ title }}

      <span class="badge bg-primary-light float-end">
        {{ transformString(status) }}
      </span>
    </h5>
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">
        Negotiation ID: {{ id }}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Created on: {{ creationDate }}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Created by: {{ submitter }}
      </h6>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: "NegotiationCard",
  props: {
    id: {
      type: String,
      default: ""
    }, 
    title: {
      type: String,
      default: ""
    }, 
    status: {
      type: String,
      default: ""
    },
    submitter: {
      type: String,
      default: ""
    },
    creationDate: {
      type: Date,
      default: undefined
    }
  },
  methods: {
    transformString(string) {
      return string ? string.toUpperCase().split('_').join(' ') : "";
    },
  }
}
</script>