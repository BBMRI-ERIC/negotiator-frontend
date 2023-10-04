<template>
  <div
    :id="id"
    class="modal"
    :class="{ fade: fade }"
    tabindex="-1"
    :aria-labelledby="`${id}Label`"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center">
        <h4 class="modal-header">
          {{ title }}
        </h4>
        <div class="modal-body">
          <slot name="body" />
        </div>
        <div class="modal-footer justify-content-center bg-light">
          <slot name="footer" />
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
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    fade: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
