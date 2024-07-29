<template>
  <div>
    <h1 class="text-left mb-5">
      Information requirements
    </h1>

    <div class="d-flex flex-row">
    <div class="col-2 ">
      <input class="form-control text-secondary-text form-control-sm" type="number" placeholder="Access-form id" v-model="accessFormId"
        number>
    </div>

    <div class="col-2 ms-3">
      <button class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle" type="button"
        data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
        Resource All Events
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownSortingButton" role="menu">
        <div v-for="(event, index) in resourceAllEvents" :key="index"
          class="form-check mx-2 my-2 text-sort-filter-dropdown-text">
          <input :id="index" class="form-check-input" type="radio" name="sort" :value="event.value"
            @change="selectedResourceAllEvents = event">
          <label class="form-check-label text-sort-filter-dropdown-text">
            {{ event.label }}
          </label>
        </div>
      </ul>
    </div>
  </div>
  <div class="col-2 my-4">
    <button class="btn btn-sm bg-new-request-button-color" @click="setInfoRequirements()">
      <span class="text-white">Set Info Requirements</span>
    </button>
  </div>
  
    <div class="row row-cols-1 row-cols-md-2 d-grid-row">

    </div>

    <div class="table">
      <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Access-form id</th>
      <th scope="col">Acces-form name</th>
      <th scope="col">event</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(requirements, index) in infoRequirements['info-requirements']"
    :key="index">
      <th scope="row">{{ requirements.id }}</th>
      <td class="text-muted">{{ requirements.id }}</td>
      <td class="text-muted">{{ requirements.requiredAccessForm.name }}</td>
      <td class="text-muted">{{ requirements.forResourceEvent }}</td>
    </tr>
  </tbody>
</table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useStore } from "vuex"

const store = useStore()

const resourceAllEvents = ref({})
const infoRequirements = ref({})

const accessFormId = ref('')
const selectedResourceAllEvents = ref({})


onMounted(async () => {
  resourceAllEvents.value = await store.dispatch("retrieveResourceAllEvents")
  infoRequirements.value = await store.dispatch("retrieveInfoRequirements")
})

async function setInfoRequirements() {
  const data = {}
  data.requiredAccessFormId = accessFormId.value
  data.forResourceEvent = selectedResourceAllEvents.value.value
  await store.dispatch("setInfoRequirements", { data })
}
</script>

<style scoped>
a:link {
  text-decoration: none;
}
</style>