<template>
  <div
    v-if="!loading"
    class="container"
  >
    <NewRequestButton />
    <div class="pt-1">
      <div class="row row-cols-2 d-grid-row mt-5 pt-3">
        <p>
          <span class="text-search-results-text"> <strong>Search results: </strong> </span> <br>
          <span class="text-muted">{{ pagination.totalElements }} Negotiations found</span>
        </p>

        <div class="text-end my-2">
          <button
            type="button"
            class="btn btn-sm me-2"
            :class="savedNegotiationsView === 'Card-one-column' ? 'btn-display-view-button-color' : savedNegotiationsView === 'Card-two-column' ? 'btn-display-view-button-color' : 'bg-body'"
            @click="setSavedNegotiationsView({negotiationsView:'Card-one-column'})"
          >
            <i class="bi bi-card-heading" />
          </button>

          <button
            v-if="negotiations.length > 1"
            type="button"
            class="btn btn-sm me-2"
            :class="savedNegotiationsView === 'Card-one-column' ? 'btn-light':'bg-body'"
            @click="setSavedNegotiationsView({negotiationsView:'Card-one-column'})"
          >
            <i class="bi bi-list" />
          </button>

          <button
            v-if="negotiations.length > 1"
            type="button"
            class="btn btn-sm me-2"
            :class="savedNegotiationsView === 'Card-two-column' ? 'btn-light':'bg-body'"
            @click="savedNegotiationsView = 'Card-two-column', setSavedNegotiationsView({negotiationsView:'Card-two-column'})"
          >
            <i class="bi bi-grid" />
          </button>

          <button
            id="v-step-1"
            type="button"
            class="btn btn-sm"
            :class="savedNegotiationsView === 'Table' ? 'btn-display-view-button-color' : 'bg-body'"
            @click="savedNegotiationsView = 'Table', setSavedNegotiationsView({negotiationsView:'Table'})"
          >
            <i class="bi bi-table" />
          </button>
        </div>
      </div>
      <div
        v-if="savedNegotiationsView === 'Card-one-column' || savedNegotiationsView === 'Card-two-column'"
        class="row row-cols-1 d-grid-row"
        :class="savedNegotiationsView === 'Card-one-column' ? 'row-cols-md-1' : 'row-cols-md-2'"
      >
        <NegotiationCard
          v-for="fn in negotiations"
          :id="fn.id"
          :key="fn.id"
          :title="fn.payload.project.title"
          :status="fn.status"
          :submitter="fn.author.name"
          :creation-date="formatDate(fn.creationDate)"
          class="cursor-pointer"
          @click="
            $router.push({
              name: 'negotiation-page',
              params: { negotiationId: fn.id, userRole: userRole, filters: filtersData, sortBy: sortby },
            })
          "
        />
      </div>

      <div v-if="savedNegotiationsView === 'Table'">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="text-nowrap">
              <tr class="text-table-header-text">
                <th scope="col">
                  Title
                  <button
                    class="btn btn-sm py-0"
                    type="button"
                    @click="changeSortDirection('title'); emitFilterSortData();"
                  >
                    <i
                      :class="filtersSortData.sortDirection === 'ASC' && filtersSortData.sortBy === 'title' ? 'bi bi-sort-alpha-up-alt' : 'bi-sort-alpha-down'"
                    />
                    <i
                      v-if="filtersSortData.sortBy !== 'title'"
                      class="bi bi-sort-alpha-up-alt"
                    />
                  </button>
                </th>
                <th scope="col">
                  Negotiation ID
                </th>
                <th scope="col">
                  Created on
                  <button
                    class="btn btn-sm py-0"
                    type="button"
                    @click="changeSortDirection('creationDate'); emitFilterSortData();"
                  >
                    <i
                      :class="filtersSortData.sortDirection === 'ASC' && filtersSortData.sortBy === 'creationDate' ? 'bi bi-sort-numeric-up-alt' : 'bi-sort-numeric-down'"
                    />
                    <i
                      v-if="filtersSortData.sortBy !== 'creationDate'"
                      class="bi bi-sort-numeric-up-alt"
                    />
                  </button>
                </th>
                <th scope="col">
                  Author
                </th>
                <th
                  scope="col"
                >
                  Status
                  <button
                    id="v-step-2"
                    class="btn btn-sm py-0"
                    type="button"
                    @click="changeSortDirection('currentState'); emitFilterSortData();"
                  >
                    <i
                      :class="filtersSortData.sortDirection === 'ASC' && filtersSortData.sortBy === 'currentState' ? 'bi bi-sort-up-alt' : 'bi-sort-down'"
                    />
                    <i
                      v-if="filtersSortData.sortBy !== 'currentState'"
                      class="bi bi-sort-up-alt"
                    />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(fn,index) in negotiations"
                :key="index"
                style="cursor: pointer;"
                @click="$router.push({
                  name: 'negotiation-page',
                  params: { negotiationId: fn.id, userRole: userRole, filters: filtersData, sortBy: sortby }
                })"
              >
                <th
                  scope="row"
                  class="text-table-title-text"
                >
                  {{ fn.payload.project.title }}
                </th>
                <td class="text-muted">
                  {{ fn.id }}
                </td>
                <td class="text-muted">
                  {{ formatDate(fn.creationDate) }}
                </td>
                <td class="text-muted">
                  {{ fn.author.name }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getBadgeColor(fn.status)"
                    style="width: 120px;"
                  >
                    <i
                      :class="getBadgeIcon(fn.status)"
                      class="px-1"
                    />
                    {{ transformStatus(fn.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2
        v-if="negotiations.length === 0"
        class="text-center"
      >
        No Negotiations found
      </h2>
    </div>

    <div
      v-if="pagination.totalElements === 0"
      class="d-flex justify-content-center"
    >
      <div class="d-flex justify-content-center">
        <h3 class="text-center mt-3">
          <i
            style="color: #7c7c7c;"
            class="bi bi-circle"
          />

          <h4 class="mb-3 ms-3 mt-3">
            There aren’t any negotiations.
          </h4>
        </h3>
      </div>
    </div>
  </div>
  <div
    v-else-if="loading"
    class="d-flex justify-content-center flex-row"
  >
    <div class="d-flex justify-content-center">
      <div
        class="spinner-border d-flex justify-content-center "
        role="status"
      />
      <div class="d-flex justify-content-center">
        <h4 class="mb-3 ms-3">
          Loading ...
        </h4>
      </div>
    </div>
  </div>
  <div
    v-else
    class="d-flex justify-content-center flex-row"
  >
    <div class="d-flex justify-content-center">
      <div class="d-flex justify-content-center">
        <h4 class="mb-3 ms-3">
          No Negotiations found :(
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from "vue"
import NegotiationCard from "@/components/NegotiationCard.vue"
import { ROLES } from "@/config/consts"
import moment from "moment"
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"
import NewRequestButton from "../components/NewRequestButton.vue"
import { useStore } from "vuex"
import { Tooltip } from "bootstrap"

const store = useStore()

const props = defineProps({
  negotiations: {
    type: Array,
    default: undefined
  },
  pagination: {
    type: Object,
    default: undefined
  },
  userRole: {
    type: String,
    required: true,
    validator: (prop) => [ROLES.RESEARCHER, ROLES.REPRESENTATIVE, ROLES.ADMINISTRATOR].includes(prop)
  },
  filtersSortData: {
    type: Object,
    default: undefined
  }
})

const sortBy = ref([
  { value: "title", label: "Title" },
  { value: "creationDate", label: "Creation Date" },
  { value: "currentState", label: "Current State" }
])

const loading = computed(() => {
  return props.negotiations === undefined
})

const savedNegotiationsView = computed(() => {
  return store.getters.getSavedNegotiationsView
})

onBeforeMount(() => {
  if (savedNegotiationsView.value === "") {
    setSavedNegotiationsView({ negotiationsView: "Table" })
  }
})

onMounted(() => {
  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']"
  })
})

function setSavedNegotiationsView (view) {
  store.dispatch("setSavedNegotiationsView", view)
}

function formatDate (date) {
  return moment(date).format("YYYY/MM/DD HH:mm")
}

function changeSortDirection (sortBy) {
  if (props.filtersSortData.sortDirection === "DESC") {
    props.filtersSortData.sortBy = sortBy
    props.filtersSortData.sortDirection = "ASC"
  } else {
    props.filtersSortData.sortBy = sortBy
    props.filtersSortData.sortDirection = "DESC"
  }
}

const emit = defineEmits(["filtersSortData"])

function emitFilterSortData () {
  emit("filtersSortData", props.filtersSortData)
}
</script>
