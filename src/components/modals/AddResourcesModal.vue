<template>
  <div
    class="modal"
    :class="{ fade: fade }"
    tabindex="-1"
    :aria-labelledby="`${id}Label`"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-xl"
    >
      <div class="modal-content">
        <div class="modal-header justify-content-center">
          <h4 class="modal-title text-center">
            Select new resources
          </h4>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div class="modal-body text-left">
          <div class="input-group flex-nowrap">
            <input
              type="text"
              class="form-control mb-3"
              placeholder="Search by name..."
              aria-label="Search"
              aria-describedby="addon-wrapping"
            >
          </div>
          <ul class="list-unstyled">
            <li
              v-for="collection in resources"
              :key="collection.id"
              class="mb-1"
            >
              <input
                :id="collection.id"
                v-model="selectedResources"
                type="checkbox"
                :value="collection.id"
                class="form-check-input"
              >
              <label
                :for="collection.id"
                class="form-check-label fs-4 ms-2"
              >{{ collection.name }}</label>
            </li>
          </ul>
          <button
            class="btn btn-primary"
            @click="addResources"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue"
import { Tooltip } from "bootstrap"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
const store = useStore()
const resources = ref([])
const selectedResources = ref([])
const props = defineProps({
  shown: {
    type: Boolean,
    required: true
  },
  negotiationId: {
    type: String,
    required: true
  }
})
watch(() => props.shown, (first, second) => {
  if (props.shown !== false) {
    loadResources()
  }
})
onMounted(() => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']"
  })
})
async function loadResources () {
  resources.value = await store.dispatch("retrieveAllResources")
}
const emit = defineEmits(["confirm"])

async function addResources () {
  const data = selectedResources.value
  const negotiationId = props.negotiationId
  await store.dispatch("addResources", { data, negotiationId }).then((response) => {
    if (response) {
      console.log(response)
    }
  })
  emit("confirm")
}

</script>

<style scoped>

</style>
