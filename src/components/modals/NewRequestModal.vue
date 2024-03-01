<template>
    <NegotiatorModal
    :id="id"
    :title="title"
    :isModalSmall="isModalSmall"
  >
    <template #body>
      <p>
        {{ text }}
      </p>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-secondary px-4"
        data-bs-dismiss="modal"
        @click="emitConfirm"
      >
        OK
      </button>
    </template>
  </NegotiatorModal>
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
        isModalSmall: {
        type: Boolean,
        required: false,
        default: false
        },
        isXButtondisplayed: {
        type: Boolean,
        required: true,
        default: true
        }
    },
    emits: ["confirm"],
    methods: {
        emitConfirm() {
        this.$emit("confirm")
        }
    }

  }
  </script>
  