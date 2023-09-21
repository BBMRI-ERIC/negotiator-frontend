<template>
  <div class="card mb-2">
    <h5 class="card-header">
      {{ negotiationTitle }}
      <span class="badge rounded-pill bg-primary float-end">
        {{ negotiationStatus }}
      </span>
    </h5>
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">
        Negotiation ID: {{ negotiationId }}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Created on: {{ negotiationCreationDate }}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Created by: {{ negotiationSubmitter }}
      </h6>
    </div>
  </div>
</template>

<script>

export default {
  name: "NegotiationCard",
  props: {
    negotiationId: {
      type: String,
      default: ""
    }, 
    negotiationTitle: {
      type: String,
      default: ""
    }, 
    negotiationStatus: {
      type: String,
      default: ""
    },
    negotiationSubmitter: {
      type: String,
      default: ""
    },
    negotiationResources: {
      type: Object,
      default: undefined
    },
    negotiationCreationDate: {
      type: Date,
      default: undefined
    },

  }
}
</script>
