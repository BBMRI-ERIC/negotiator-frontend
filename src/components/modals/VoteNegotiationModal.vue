<template>
  <VoteModal
    :id="id"
    :title="title"
    :is-x-buttondisplayed="false"
  >
    <template #body>
      <span class="text-warning">*</span> <span>Required</span>
      <h5 class="text-center">
        {{ text }}
      </h5>
      <p class="text-muted">
        We kindly ask the SMB to vote on the following:
      </p>

      <div class="text-left mb-2">
        Do you agree to approve and grant the following applications in the "Open Call for Transnational
        Service Provision" call?<span class="text-warning">*</span>
      </div>

      <div class="check-box">
        <div class="form-check">
          <input
            id="flexRadioDefault1"
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''"
            @click="vote = 'Yes',isSectionValid()"
          >
          <label
            class="form-check-label"
            for="flexRadioDefault1"
          >
            Yes
          </label>
        </div>
        <div class="form-check">
          <input
            id="flexRadioDefault2"
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''"
            @click="vote = 'No',isSectionValid()"
          >
          <label
            class="form-check-label"
            for="flexRadioDefault2"
          >
            No
          </label>
        </div>
        <div class="form-check">
          <input
            id="flexRadioDefault3"
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''"
            @click="vote = 'Abstain',isSectionValid()"
          >
          <label
            class="form-check-label"
            for="flexRadioDefault2"
          >
            Abstain
          </label>
        </div>
        <p
          v-if="validationColorHighlight === false"
          class="py-2 text-danger"
        >
          Please provide a Required field*
        </p>
      </div>
      <p class="mt-4">
        Do you have any additional comments?
      </p>

      <div class="form-group">
        <textarea
          placeholder="Enter your answer"
          rows="3"
          style="width: 100%"
        />
      </div>
    </template>
    <template #footer>
      <button
        type="button"
        class="btn btn-dark"
        data-bs-dismiss="modal"
      >
        Cancel
      </button>
      <button
        v-if="validationColorHighlight === null || validationColorHighlight === false"
        type="button"
        class="btn btn-success"
        @click="isSectionValid"
      >
        Confirm
      </button>
      <button
        v-else
        type="button"
        class="btn btn-success"
        data-bs-dismiss="modal"
        @click="emitConfirm"
      >
        Confirm
      </button>
    </template>
  </VoteModal>
</template>

<script setup>
import { ref } from "vue"
import VoteModal from "./VoteModal.vue"

const props = defineProps({
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
  }
})

const emit = defineEmits(["confirm"])

const vote = ref("")
const validationColorHighlight = ref(null)

function isSectionValid () {
  if (vote.value === "") {
    validationColorHighlight.value = false
  } else {
    validationColorHighlight.value = true
  }
}

function emitConfirm () {
  emit("confirm")
}
</script>
