<template>
  <VoteModal :id="id" :title="title" :is-x-buttondisplayed="false">
    <template #body>
      <h5 class="text-center">
        Form for feasibility check
      </h5>
      <p class="text-muted text-center">
        (same for regular and fast-track evaluation process)
      </p>
      <div class="text-end"> <span class="text-warning">*</span> <span>Required</span>
      </div>
      <span class="fs-5 fw-bold text-primary-text mt-3">
        <i class="bi bi-check2-square" />
        Result of feasibility check
      </span>


      <div class="text-left mt-3 mb-2">
        Is the requested service feasible for the service provider?
      </div>

      <div class="check-box">
        <div class="form-check">
          <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''" @click="vote = 'Yes', isSectionValid()">
          <label class="form-check-label" for="flexRadioDefault1">
            Yes
          </label>
        </div>
        <div class="form-check">
          <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''" @click="vote = 'No', isSectionValid()">
          <label class="form-check-label" for="flexRadioDefault2">
            No
          </label>
        </div>
        <p v-if="validationColorHighlight === false" class="py-2 text-danger">
          Please provide a Required field*
        </p>
      </div>

      <div class="text-left mb-2">
        Is the planned timing feasible for the service provider?
      </div>

      <div class="check-box">
        <div class="form-check">
          <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''" @click="vote = 'Yes', isSectionValid()">
          <label class="form-check-label" for="flexRadioDefault1">
            Yes
          </label>
        </div>
        <div class="form-check">
          <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault"
            :class="validationColorHighlight === false ? 'is-invalid' : ''" @click="vote = 'No', isSectionValid()">
          <label class="form-check-label" for="flexRadioDefault2">
            No
          </label>
        </div>
        <p v-if="validationColorHighlight === false" class="py-2 text-danger">
          Please provide a Required field*
        </p>
      </div>

      <div class="d-flex flex-row mb-3 justify-content-between mt-3" style="min-height: 38px;">
        <div data-bs-toggle="collapse" data-bs-target="#costEstimation" aria-controls="costEstimation"
          aria-expanded="true" type="button">
          <span class="fs-5 fw-bold text-primary-text mt-3">
            <i class="bi bi-cash-coin" />
            Cost Estimation
          </span>
        </div>
        <div data-bs-toggle="collapse" data-bs-target="#costEstimation" aria-controls="costEstimation"
          aria-expanded="false" type="button" class="cost-estimation-header justify-content-end pt-1">
          <i class="bi bi-chevron-down" />
          <i class="bi bi-chevron-up" />
        </div>
      </div>
      <div id="costEstimation" class="collapse">
        <div class="form-group col-md-6 mb-3">
          <label>New estimated Unit Cost</label>
          <input type="number" class="form-control" placeholder="enter number">
        </div>

        <div class="form-group col-md-6 mb-3">
          <label>New Number of Units</label>
          <input type="number" class="form-control" placeholder="enter number">
        </div>

        <div class="form-group col-md-6 mb-3">
          <label>New estimated Actual Cost</label>
          <input type="number" class="form-control" placeholder="enter number">
        </div>

        <div class="text-left mb-3">
          Is there a cost estimation uploaded for the actual costs in the folder or is the information detailled in the
          feasibility check template?
          (yes,separate table uploaded / cost calculation is explained is in the feasibility check template / task
          pending)
        </div>

        <div class="check-box mb-3">
          <div class="form-check">
            <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault1">
              Yes
            </label>
          </div>
          <div class="form-check">
            <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault2">
              No
            </label>
          </div>
        </div>

        <div class="text-left mb-3">
          Was there a change in the cost methodology
          ( no/yes: from unit to actual, from actual to unit, from combined to actual, from combined to unit )
        </div>

        <div class="check-box mb-3">
          <div class="form-check">
            <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault1">
              Yes
            </label>
          </div>
          <div class="form-check">
            <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault2">
              No
            </label>
          </div>
        </div>

        <div class="text-left mb-3">
          Is there an update TNA Sheet for the Unit cost uploaded in the folder?
          (yes/no)
          Please note that it is mandatory to update the TNA sheet:
          - in case of unit cost,
          in case the cost methodology changed.
          The new TNA sheet will be used until the end of the project anytime this is requested again, unless you
          indicate a change again..
        </div>

        <div class="check-box mb-3">
          <div class="form-check">
            <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault1">
              Yes
            </label>
          </div>
          <div class="form-check mb-3">
            <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault2">
              No
            </label>
          </div>
        </div>

        <div class="text-left mb-3">
          Status of feasbility check
          (ongoing/completed)
        </div>

        <div class="check-box mb-3">
          <div class="form-check">
            <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault1">
              ongoing
            </label>
          </div>
          <div class="form-check mb-3">
            <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault2">
              completed
            </label>
          </div>
        </div>

        <div class="form-group col-md-12 mb-3">
          <label>Did you add a new service provider then what was originally requested by the applicant?
            (no/yes: name of new service and SP)
            If yes, please make sure that the cost refers to the new SP.</label>
          <input type="text" class="form-control" placeholder="(no/yes: name of new service and SP)">
        </div>

        <div class="text-left mb-3">
          Result of feasbility check for the service
        </div>

        <div class="check-box mb-3">
          <div class="form-check">
            <input id="flexRadioDefault1" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault1">
              Yes
            </label>
          </div>
          <div class="form-check">
            <input id="flexRadioDefault2" class="form-check-input" type="radio" name="flexRadioDefault">
            <label class="form-check-label" for="flexRadioDefault2">
              No
            </label>
          </div>
        </div>
      </div>

      <span class="fs-5 fw-bold text-primary-text mt-4">
        <i class="bi bi-chat-dots" />
        Comments
      </span>

      <p class="mt-4">
        Comments from user (if
        applicable)
      </p>

      <div class="form-group">
        <textarea placeholder="Enter your answer" rows="3" style="width: 100%" />
      </div>

      <p class="mt-4">
        Comments from service provider (if applicable)
      </p>

      <div class="form-group">
        <textarea placeholder="Enter your answer" rows="3" style="width: 100%" />
      </div>

      <p class="mt-4">
        Comments from TNA manager (if applicable)
      </p>

      <div class="form-group">
        <textarea placeholder="Enter your answer" rows="3" style="width: 100%" />
      </div>
    </template>
    <template #footer>
      <button type="button" class="btn btn-dark" data-bs-dismiss="modal">
        Cancel
      </button>
      <button v-if="validationColorHighlight === null || validationColorHighlight === false" type="button"
        class="btn btn-success" @click="isSectionValid">
        Confirm
      </button>
      <button v-else type="button" class="btn btn-success" data-bs-dismiss="modal" @click="emitConfirm">
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

function isSectionValid() {
  if (vote.value === "") {
    validationColorHighlight.value = false
  } else {
    validationColorHighlight.value = true
  }
}

function emitConfirm() {
  emit("confirm")
}
</script>

<style scoped>
.cost-estimation-header[aria-expanded=true] .bi-chevron-down {
  display: none;
}

.cost-estimation-header:not([aria-expanded]) .bi-chevron-up {
  display: none;
}

.cost-estimation-header[aria-expanded=false] .bi-chevron-up {
  display: none;
}
</style>
