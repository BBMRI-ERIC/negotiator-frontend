<template>
  <div
    :id="id"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="{{id}}Label"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            Resource ID: {{ resourceId }}
          </h4>
        </div>
        <div class="modal-body">
          <NegotiationPosts 
            :negotiation="negotiation"
            :user-role="userRole"
            scope="private"
            :resource-id="resourceId"
          />
        </div>
        <div class="modal-footer justify-content-center bg-primary">
          <button
            type="button"
            class="btn btn-info"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div> 
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
