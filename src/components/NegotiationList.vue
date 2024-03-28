<template>
  <div
    v-if="!loading"
    class="container"
  >
    <div
      class="px-3 pt-1 header-bar card sticky-top border-0 shadow-sm container"
      style="top: 65px"
    >
      <div class="row mb-2">
        <div class="d-flex flex-row flex-wrap">
          <div
            id="v-step-3"
            class="dropdown b-dropdown mb-2 mx-2 filter-dropdown position-static btn-group d-flex justify-content-start"
          >
            <button
              id="dropdownSortingButton"
              aria-haspopup="true"
              class="btn dropdown-toggle"
              :class="{
                'btn-sort-filter-button-outline': sortBy.sortColumn != undefined,
                'btn-outline-sort-filter-button-outline' : sortBy.sortColumn == undefined,
                'show': sortBy.sortColumn != undefined
              }"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
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
                v-for="(value, name) in sortAttrs"
                :key="name"
                class="form-check mx-2 my-2 text-sort-filter-dropdown-text"
              >
                <input
                  :id="name"
                  class="form-check-input"
                  type="radio"
                  name="sort"
                  :value="name"
                  :checked="isChecked(name)"
                  @change="triggerSort($event.target.value)"
                >
                <label
                  class="form-check-label"
                  :for="name"
                >
                  {{ value.label }}
                </label>
              </div>
            </ul>
          </div>
          <div class="dropdown mb-2 mx-2 filter-dropdown position-static btn-group d-flex justify-content-start">
            <button
              id="dropdownMenuButton1"
              aria-haspopup="true"
              class="btn dropdown-toggle"
              :class="{
                'btn-sort-filter-button-outline': filters.status.length > 0,
                'btn-outline-sort-filter-button-outline' : filters.status.length === 0,
                'show': filters.status.length > 0 || !statusFilterFirstLoad
              }"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              Filter by status
              <span
                v-if="filters.status.length > 0"
                class="badge bg-primary border ms-2"
              > {{ filters.status.length }}</span>
            </button>
            <ul
              class="dropdown-menu text-sort-filter-dropdown-text"
              aria-labelledby="dropdownMenuButton1"
            >
              <div class="mx-2 my-2 dropdown-contents">
                <div class="form-check">
                  <input
                    id="submitted"
                    v-model="submittedSelection"
                    class="form-check-input"
                    type="checkbox"
                    value="submitted"
                    @change="updateFilter('status', 'SUBMITTED', submittedSelection)"
                  >
                  <label
                    class="form-check-label"
                    for="submitted"
                  >
                    Submitted
                  </label>
                </div>
                <div class="form-check">
                  <input
                    id="ongoing"
                    v-model="ongoingSelection"
                    class="form-check-input"
                    type="checkbox"
                    value="ongoing"
                    @change="updateFilter('status', 'IN_PROGRESS', ongoingSelection)"
                  >
                  <label
                    class="form-check-label"
                    for="ongoing"
                  >
                    In progress
                  </label>
                </div>
                <div class="form-check">
                  <input
                    id="abandoned"
                    v-model="abandonedSelection"
                    class="form-check-input"
                    type="checkbox"
                    value="abandoned"
                    @change="updateFilter('status', 'ABANDONED', abandonedSelection)"
                  >
                  <label
                    class="form-check-label"
                    for="abandoned"
                  >
                    Abandoned
                  </label>
                </div>
              </div>
            </ul>
          </div>
          <div class="dropdown b-dropdown mb-2 mx-2 filter-dropdown position-static btn-group d-flex justify-content-start">
            <button
              id="dropdownMenuButton1"
              aria-haspopup="true"
              class="btn dropdown-toggle"
              :class="{
                'btn-sort-filter-button-outline': filters.dateStart !== '' || filters.dateEnd !== '',
                'btn-outline-sort-filter-button-outline' : filters.dateStart === '' && filters.dateEnd === '',
                'show': filters.dateStart !== '' || filters.dateEnd !== '' || !dateFilterFirstLoad
              }"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              Filter by Date
              <span
                v-if="filters.dateStart != '' || filters.dateEnd != ''"
                class="badge bg-primary border ml-2"
              > {{ dateFilterLength }}</span>
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
                    v-model="selectedStartDate"
                    class="form-control text-sort-filter-dropdown-text"
                    type="date"
                    @input="updateFilter('dateStart', selectedStartDate)"
                  >
                </div>
                <div class="d-flex align-items-center">
                  <label
                    for="endDate"
                    class="pe-2 w-25"
                  >End:</label>
                  <input
                    id="endDate"
                    v-model="selectedEndDate"
                    class="form-control text-sort-filter-dropdown-text"
                    type="date"
                    @input="updateFilter('dateEnd', selectedEndDate)"
                  >
                </div>
              </div>
            </ul>
          </div>
          <div class="dropdown mb-2  b-dropdown ms-auto filter-dropdown position-static btn-group d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-outline-sort-filter-clear-button-outline"
              @click="clearAllFilters()"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <NewRequestButton />
    <div>
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
            v-if="sortedNegotiations.length > 1"
            type="button"
            class="btn btn-sm me-2"
            :class="savedNegotiationsView === 'Card-one-column' ? 'btn-light':'bg-body'"
            @click="setSavedNegotiationsView({negotiationsView:'Card-one-column'})"
          >
            <i class="bi bi-list" />
          </button>

          <button
            v-if="sortedNegotiations.length > 1"
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
          v-for="fn in sortedNegotiations"
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
              params: { negotiationId: fn.id, userRole: userRole, filters: filters, sortBy: sortby },
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
                v-for="(fn,index) in sortedNegotiations"
                :key="index"
                @click="$router.push({
                  name: 'negotiation-page',
                  params: { negotiationId: fn.id, userRole: userRole, filters: filters, sortBy: sortby }
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
        v-if="sortedNegotiations.length === 0"
        class="text-center"
      >
        No Negotiations found
      </h2>
    </div>

    <nav
      v-if="sortedNegotiations.length > 0 && pagination.totalPages > 1"
      aria-label="Page navigation example"
    >
      <ul class="pagination justify-content-center mt-2">
        <li
          class="page-item"
          :class="currentPageNumber === 1 ? 'disabled' : ''"
        >
          <a
            class="page-link"
            href="#"
            tabindex="-1"
            aria-disabled="true"
            @click="changeCurrentPage(currentPageNumber - 1)"
          >Previous</a>
        </li>
        <li
          v-for="page in pagination.totalPages"
          :key="page"
          class="page-item"
        >
          <a
            class="page-link"
            href="#"
            @click="changeCurrentPage(page)"
          >
            {{ page }}
          </a>
        </li>
        <li
          class="page-item"
          :class="currentPageNumber < pagination.totalPages ? '' : 'disabled'"
        >
          <a
            class="page-link "
            href="#"
            @click="changeCurrentPage(currentPageNumber + 1)"
          >Next</a>
        </li>
      </ul>
    </nav>

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
import backendSettings from "@/config/backend"

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
  emits: ["currentPageNumber", "filterStatus"],

  data () {
    return {
      availableRoles: ROLES,
      sortAttrs: {
        title: {
          label: "Title",
          sortTransformation: (value) => value.payload.project.title,
          sortOrder: "asc"
        },
        status: {
          label: "Status",
          sortTransformation: (value) => value.status,
          sortOrder: "asc"
        },
        creationDate: {
          label: "Date of creation",
          sortTransformation: (value) => new Date(value.creationDate),
          sortOrder: "desc"
        }
      },
      filters: {
        status: [],
        dateStart: "",
        dateEnd: ""
      },
      filtersStatus: [
        { value: "SUBMITTED", label: "Submitted" },
        { value: "APPROVED", label: "Approved" },
        { value: "DECLINED", label: "Declined" },
        { value: "IN_PROGRESS", label: "In progress" },
        { value: "PAUSED", label: "Paused" },
        { value: "CONCLUDED", label: "Concluded" },
        { value: "ABANDONED", label: "Abandoned" }
      ],
      sortBy: { sortColumn: undefined },
      isSortFromURL: true,
      statusFilterFirstLoad: true,
      dateFilterFirstLoad: true,
      currentPageNumber: 1
    }
  },
  computed: {
    backendSettings () {
      return backendSettings
    },
    filteredNegotiations: function () {
      const filterConditions = []
      if (this.filters.status.length > 0) {
        filterConditions.push(item => this.filters.status.includes(item.status))
      }
      if (this.filters.dateStart !== "") {
        const startDate = new Date(this.filters.dateStart)
        filterConditions.push(item => {
          const eventDate = new Date(item.creationDate)
          return eventDate >= startDate
        })
      }
      if (this.filters.dateEnd !== "") {
        const endDate = new Date(this.filters.dateEnd)
        filterConditions.push(item => {
          const eventDate = new Date(item.creationDate)
          return eventDate <= endDate
        })
      }
      const filteredNegotiations = filterConditions.length === 0 ? this.negotiations : this.negotiations.filter(item => filterConditions.every(f => f(item)))
      return filteredNegotiations
    },
    sortedNegotiations: function () {
      if (this.sortBy.sortColumn !== undefined && this.isSortFromURL) {
        return this.sort(this.sortBy.sortColumn)
      }
      return this.filteredNegotiations
    },
    loading () {
      return this.negotiations === undefined
    },
    dateFilterLength () {
      if (this.filters.dateStart !== "" && this.filters.dateEnd !== "") {
        return 2
      }
      return 1
    },
    ...mapGetters({ savedNegotiationsView: "getSavedNegotiationsView" })
  },
  beforeMount () {
    this.loadActiveFiltersFromURL()
    this.loadSortingFromURL()
    if (this.savedNegotiationsView === "") {
      this.setSavedNegotiationsView({ negotiationsView: "Table" })
    }
  },
  methods: {
    ...mapActions([
      "setSavedNegotiationsView", "retrieveNegotiations"
    ]),
    triggerSort (column) {
      this.sortBy.sortColumn = column
      this.updateRoutingParams(this.activeFilters(this.filters), this.sortBy)
      this.isSortFromURL = false
      return this.sort(column)
    },
    sort (column) {
      const sortedNegotiations = this.filteredNegotiations
      return sortedNegotiations.sort((a, b) => {
        a = this.sortAttrs[column].sortTransformation(a)
        b = this.sortAttrs[column].sortTransformation(b)
        if (a < b) {
          return this.sortAttrs[column].sortOrder === "desc" ? 1 : -1
        }
        if (a > b) {
          return this.sortAttrs[column].sortOrder === "desc" ? -1 : 1
        }
        return 0
      })
    },
    formatDate (date) {
      return moment(date).format("YYYY/MM/DD HH:mm")
    },
    updateFilter (filterName, filterValue, selection) {
      if (filterName === "status") {
        this.statusFilterFirstLoad = false
        if (selection) {
          this.filters[filterName].push(filterValue)
        } else {
          this.filters[filterName].splice(this.filters[filterName].indexOf(filterValue), 1)
        }
      } else {
        this.dateFilterFirstLoad = false
        this.filters[filterName] = filterValue
      }
      // update the url according to fiter(s)
      this.updateRoutingParams(this.activeFilters(this.filters), this.sortBy)
    },
    activeFilters (filters) {
      const activeFilters = {}
      for (const key in filters) {
        if ((key === "status" && filters[key] != []) || (key !== "status" && filters[key] !== "")) {
          activeFilters[key] = filters[key]
        }
      }
      return activeFilters
    },
    loadSortingFromURL () {
      this.sortBy.sortColumn = this.$route.query.sortColumn
    },
    loadActiveFiltersFromURL () {
      if (this.$route.query.status) {
        this.statusFilterFirstLoad = false
        const statusArray = [
          NEGOTIATION_STATUS.SUBMITTED,
          NEGOTIATION_STATUS.IN_PROGRESS,
          NEGOTIATION_STATUS.ABANDONED
        ]
        if (typeof this.$route.query.status === "string") {
          this.filters.status.push(this.$route.query.status)
          if (statusArray.includes(this.$route.query.status)) {
            this.submittedSelection = value === NEGOTIATION_STATUS.SUBMITTED
            this.ongoingSelection = value === NEGOTIATION_STATUS.IN_PROGRESS
            this.abandonedSelection = value === NEGOTIATION_STATUS.ABANDONED
          }
        } else {
          for (const status of this.$route.query.status) {
            this.filters.status.push(status)
            if (statusArray.includes(status)) {
              this.submittedSelection = status === NEGOTIATION_STATUS.SUBMITTED || this.submittedSelection
              this.ongoingSelection = status === NEGOTIATION_STATUS.IN_PROGRESS || this.ongoingSelection
              this.abandonedSelection = status === NEGOTIATION_STATUS.ABANDONED || this.abandonedSelection
            }
          }
        }
      }
      if (this.$route.query.dateStart || this.$route.query.dateEnd) {
        this.dateFilterFirstLoad = false
        if (this.$route.query.dateStart) {
          this.filters.dateStart = this.selectedStartDate = this.$route.query.dateStart
        }
        if (this.$route.query.dateEnd) {
          this.filters.dateEnd = this.selectedEndDate = this.$route.query.dateEnd
        }
      }
    },
    updateRoutingParams (filters, sortBy) {
      const query = {}
      Object.assign(query, filters, sortBy)
      this.$router.replace({ query })
    },
    clearAllFilters () {
      this.filters = {
        status: [],
        dateStart: "",
        dateEnd: ""
      }
      this.selectedStartDate = ""
      this.selectedEndDate = ""
      const query = {}
      this.$router.replace({ query })
    },
    isChecked (value) {
      return this.sortBy.sortColumn === value
    },
    changeCurrentPage (pageNumber) {
      this.$emit("currentPageNumber", pageNumber)
      this.currentPageNumber = pageNumber
    },
    filterStatus (status) {
      this.$emit("filterStatus", status)
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
