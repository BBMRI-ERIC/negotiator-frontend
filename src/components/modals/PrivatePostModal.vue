<template>
  <NegotiationModal
    :id="id"
    :title="`Resource: ${resourceId}`"
  >
    <template #body>
      <NegotiationPosts 
        :negotiation="negotiation"
        :user-role="userRole"
        scope="private"
        :resource-id="resourceId"
      />
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-info"
        data-bs-dismiss="modal"
      >
        Close
      </button>
    </template>
  </NegotiationModal>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    resourceId: {
      type: String,
      required: true
    },
    negotiation: {
      type: Object,
      required: true
    },
    userRole: {
      type: String,
      required: true
    }
  }
}
</script>
