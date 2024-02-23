<template>
  <div>
  <div class="card mb-2">
    <h5 class="card-header bg-body text-card-title-text">
    {{ title }}

      <h6 class="float-end" >
        <span :class="getBadgeColor(status)" class="badge" style="width: 125px;" >
          <i :class="getBadgeIcon(status)" class="px-1"/>
          {{ transformStatus(status) }}
        </span>
      </h6>
    </h5>
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">
        Negotiation ID: {{ id }}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Created on: {{ creationDate }}
      </h6>
      <h6 class="card-subtitle mb-2 text-muted">
        Author: {{ submitter }}
      </h6>
    </div>
  </div>
</div>
</template>

<script>
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"

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
    transformStatus(string) {
      return transformStatus(string)
    },
    getBadgeColor(badgeText) {
      return getBadgeColor(badgeText)
    },
    getBadgeIcon(badgeText) {
      return getBadgeIcon(badgeText)
    },
  }
}
</script>