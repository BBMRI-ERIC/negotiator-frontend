<template>
  <div
    v-if="!loading"
    class="container"
  >
    <div class="d-flex flex-row flex-wrap justify-content-between">
      <div class="d-flex flex-row gap-2 my-2 mx-auto mx-md-0">
        <div class="sort-by">
          <button
            class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle"
            :class="filtersSortData.sortBy ? 'btn-primary': ''"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort by
          </button>
          <ul
            class="dropdown-menu"
            aria-labelledby="dropdownSortingButton"
            role="menu"
          >
            <div
              v-for="(sort, index) in sortBy"
              :key="index"
              class="form-check mx-2 my-2 text-sort-filter-dropdown-text"
            >
              <input
                :id="index"
                v-model="filtersSortData.sortBy"
                class="form-check-input"
                type="radio"
                name="sort"
                :value="sort.value"
                :checked="isChecked(index)"
                @change="emitFilterSortData"
              >
              <label
                class="form-check-label"
              >
                {{ sort.label }}
              </label>
            </div>
          </ul>
        </div>
        <div class="filter-by-status">
          <button
            class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle"
            :class="filtersSortData.status.length > 0 ? 'btn-primary':''"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by status
          </button>
          <ul
            class="dropdown-menu"
            aria-labelledby="dropdownSortingButton"
            role="menu"
          >
            <div
              v-for="(status, index) in filtersStatus"
              :key="index"
              class="form-check mx-2 my-2"
            >
              <input
                id="submitted"
                v-model="filtersSortData.status"
                class="form-check-input"
                type="checkbox"
                :value="status.value"
                @change="emitFilterSortData"
              >
              <label
                class="form-check-label"
                for="submitted"
              >
                {{ status.label }}
              </label>
            </div>
          </ul>
        </div>

        <div class="filter-by-date">
          <button
            class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle"
            :class="filtersSortData.dateStart !== '' || filtersSortData.dateEnd !== '' ? 'btn-primary':''"

            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by date
          </button>
          <ul
            class="dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
          >
            <div class="mx-2 my-2 dropdown-contents text-sort-filter-dropdown-text">
              <div class="d-flex align-items-center mb-2">
                <label
                  class="pe-2 w-25"
                  for="startDate"
                >Start:</label>
                <input
                  id="startDate"
                  v-model="filtersSortData.dateStart"
                  class="form-control text-sort-filter-dropdown-text"
                  type="date"
                  @input="emitFilterSortData"
                >
              </div>
              <div class="d-flex align-items-center">
                <label
                  for="endDate"
                  class="pe-2 w-25"
                >End:</label>
                <input
                  id="endDate"
                  v-model="filtersSortData.dateEnd"
                  class="form-control text-sort-filter-dropdown-text"
                  type="date"
                  @input="emitFilterSortData"
                >
              </div>
            </div>
          </ul>
        </div>

        <button
          class="btn btn-sm btn-outline-sort-filter-button-outline"
          type="button"
          @click="changeSortDirection(); emitFilterSortData();"
        >
          <i
            v-if="filtersSortData.sortDirection === 'DESC'"
            class="bi bi-sort-down"
          />
          <i
            v-if="filtersSortData.sortDirection === 'ASC'"
            class="bi bi-sort-up"
          />
        </button>
      </div>

      <div class="my-2 ms-auto">
        <button
          type="button"
          class="btn btn-sm btn-outline-sort-filter-clear-button-outline"
          @click="clearAllFilters()"
        >
          <i class="bi bi-x-circle" />

          Clear all filters
        </button>
      </div>
    </div>

    <NewRequestButton />
    <div class="pt-1">
      <div class="row row-cols-2 d-grid-row mt-5 ">
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
            <thead>
              <tr class="text-table-header-text">
                <th scope="col">
                  Title
                </th>
                <th scope="col">
                  Negotiation ID
                </th>
                <th scope="col">
                  Created on
                </th>
                <th scope="col">
                  Author
                </th>
                <th
                  id="v-step-2"
                  scope="col"
                >
                  Status
                </th>
                <th scope="col" />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(fn,index) in negotiations"
                :key="index"
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
                <td>
                  <i class="bi bi-chevron-right float-end" />
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

<script>
import NegotiationCard from "@/components/NegotiationCard.vue"
import { ROLES, NEGOTIATION_STATUS } from "@/config/consts"
import { mapGetters, mapActions } from "vuex"
import moment from "moment"
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"
import NewRequestButton from "../components/NewRequestButton.vue"

export default {
  name: "NegotiationsList",
  components: { NegotiationCard, NewRequestButton },
  props: {
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
      validator: function (value) {
        return [ROLES.RESEARCHER, ROLES.REPRESENTATIVE].includes(value)
      }
    }
  },
  emits: ["filtersSortData"],
  data () {
    return {
      availableRoles: ROLES,
      filtersStatus: [
        { value: "SUBMITTED", label: "Submitted" },
        { value: "APPROVED", label: "Approved" },
        { value: "DECLINED", label: "Declined" },
        { value: "IN_PROGRESS", label: "In progress" },
        { value: "PAUSED", label: "Paused" },
        { value: "CONCLUDED", label: "Concluded" },
        { value: "ABANDONED", label: "Abandoned" }
      ],
      sortBy: [
        { value: "title", label: "Title" },
        { value: "creationDate", label: "Creation Date" },
        { value: "currentState", label: "Current State" }
      ],
      filtersSortData: {
        status: [],
        dateStart: "",
        dateEnd: "",
        sortBy: "",
        sortDirection: "DESC"
      }
    }
  },
  computed: {

    loading () {
      return this.negotiations === undefined
    },

    ...mapGetters({ savedNegotiationsView: "getSavedNegotiationsView" })
  },
  beforeMount () {
    if (this.savedNegotiationsView === "") {
      this.setSavedNegotiationsView({ negotiationsView: "Table" })
    }
  },
  methods: {
    ...mapActions([
      "setSavedNegotiationsView"
    ]),
    emitFilterSortData () {
      this.$emit("filtersSortData", this.filtersSortData)
    },
    changeSortDirection () {
      if (this.filtersSortData.sortDirection === "DESC") {
        this.filtersSortData.sortDirection = "ASC"
      } else {
        this.filtersSortData.sortDirection = "DESC"
      }
    },
    formatDate (date) {
      return moment(date).format("YYYY/MM/DD HH:mm")
    },
    clearAllFilters () {
      this.filtersSortData = {
        status: [],
        dateStart: "",
        dateEnd: "",
        sortBy: "",
        sortDirection: "DESC"
      }
    },
    isChecked (value) {
      return "this.sortBy.sortColumn === value"
    },
    transformStatus (string) {
      return transformStatus(string)
    },
    getBadgeColor (badgeText) {
      return getBadgeColor(badgeText)
    },
    getBadgeIcon (badgeText) {
      return getBadgeIcon(badgeText)
    }
  }
}
</script>
