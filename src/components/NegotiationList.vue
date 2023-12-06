<template>
  <div
    class="px-3 pt-1 header-bar card sticky-top border-0 shadow-sm container"
    style="top: 50px"
  >
    <div class="row mb-2">
      <div
        class="col-2"
      />
      <div class="col-8">
        <div class="d-flex flex-row">
          <div class="dropdown b-dropdown mx-2 filter-dropdown position-static btn-group d-flex justify-content-start">
            <button
              id="dropdownSortingButton"
              aria-haspopup="true"
              class="btn dropdown-toggle"
              :class="{ 
                'btn-secondary': sortBy.sortColumn != undefined, 
                'btn-outline-secondary' : sortBy.sortColumn == undefined, 
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
                class="form-check mx-2 my-2"
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
          <div class="dropdown mx-2 filter-dropdown position-static btn-group d-flex justify-content-start">
            <button
              id="dropdownMenuButton1"
              aria-haspopup="true"
              class="btn dropdown-toggle"
              :class="{ 
                'btn-secondary': filters.status.length > 0, 
                'btn-outline-secondary' : filters.status.length === 0,
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
              class="dropdown-menu"
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
          <div class="dropdown b-dropdown mx-2 filter-dropdown position-static btn-group d-flex justify-content-start">
            <button
              id="dropdownMenuButton1"
              aria-haspopup="true"
              class="btn dropdown-toggle"
              :class="{ 
                'btn-secondary': filters.dateStart !== '' || filters.dateEnd !== '', 
                'btn-outline-secondary' : filters.dateStart === '' && filters.dateEnd === '',
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
              <div class="mx-2 my-2 dropdown-contents">
                <div class="d-flex align-items-center mb-2">
                  <label
                    class="pe-2 w-25"
                    for="startDate"
                  >Start:</label>
                  <input
                    id="startDate"
                    v-model="selectedStartDate"
                    class="form-control"
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
                    class="form-control"
                    type="date"
                    @input="updateFilter('dateEnd', selectedEndDate)"
                  >
                </div>
              </div>
            </ul>
          </div> 
          <div class="dropdown b-dropdown ms-auto filter-dropdown position-static btn-group d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="clearAllFilters()"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <hr class="my-4">
  <div
    v-if="!loading"
    class="container"
  >
    <div class="row">
      <div
        class="col-2 align-self-center"
      />
      <div
        class="col-8 align-self-center"
      >
        <div
          class="col-2 align-self-center"
        />
        <p v-if="sortedNegotiations.length >0">
          <strong>Search results : </strong><br>
          {{ sortedNegotiations.length }} Negotiations found
        </p>
        <NegotiationCard
          v-for="fn in sortedNegotiations"
          :id="fn.id"
          :key="fn.id"
          :title="fn.payload.project.title"
          :status="fn.status"
          :submitter="fn.persons.filter(p => p.role === availableRoles.RESEARCHER)[0].name"
          :creation-date="formatDate(fn.creationDate)"
          class="cursor-pointer"
          @click="
            $router.push({
              name: 'negotiation-page',
              params: { negotiationId: fn.id, userRole: userRole, filters: filters, sortBy: sortby },
            })
          "
        />
        <h2
          v-if="sortedNegotiations.length ===0"
          class="text-center"
        >
          No Negotiations found
        </h2>
      </div>
    </div>
  </div>
  <div
    v-else
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
</template>

<script>
import NegotiationCard from "@/components/NegotiationCard.vue"
import { ROLES, NEGOTIATION_STATUS } from "@/config/consts"
import moment from "moment"


export default {
  name: "NegotiationsList",
  components: { NegotiationCard, 
  },
  props: {
    negotiations: {
      type: Array,
      default: undefined
    },
    userRole: {
      type: String,
      required: true,
      validator: function (value) {
        return [ROLES.RESEARCHER, ROLES.REPRESENTATIVE].includes(value)
      },

    }
  },
  data() {
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
      sortBy: { sortColumn: undefined },
      isSortFromURL: true, 
      statusFilterFirstLoad: true,
      dateFilterFirstLoad: true
    }
  }, 
  computed: {
    filteredNegotiations: function() {
      let filterConditions = []
      if (this.filters.status.length > 0) {
        filterConditions.push(item => this.filters["status"].includes(item.status))
      }
      if (this.filters.dateStart != "") {
        const startDate = new Date(this.filters["dateStart"])
        filterConditions.push(item => {
          const eventDate = new Date(item.creationDate)
          return eventDate >= startDate
        })     
      }
      if (this.filters.dateEnd != "") {
        const endDate = new Date(this.filters["dateEnd"])
        filterConditions.push(item => {
          const eventDate = new Date(item.creationDate)
          return eventDate <= endDate
        })     
      }
      let filteredNegotiations = filterConditions.length === 0 ? this.negotiations : this.negotiations.filter(item => filterConditions.every(f => f(item)))
      return filteredNegotiations
    },
    sortedNegotiations: function() {
      if (this.sortBy.sortColumn != undefined  && this.isSortFromURL){
        return this.sort(this.sortBy.sortColumn)
      }
      return this.filteredNegotiations
    },
    loading() {
      return this.negotiations === undefined
    },
    dateFilterLength() {
      if(this.filters.dateStart != "" && this.filters.dateEnd != ""){
        return 2
      }
      return 1
    },
  },
  beforeMount() {
    this.loadActiveFiltersFromURL()
    this.loadSortingFromURL()
  },
  methods: {
    triggerSort(column) {
      this.sortBy.sortColumn = column
      this.updateRoutingParams(this.activeFilters(this.filters), this.sortBy)
      this.isSortFromURL = false
      return this.sort(column)
    },
    sort(column) {
      let sortedNegotiations = this.filteredNegotiations
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
    formatDate(date) {
      return moment(date).format("YYYY/MM/DD HH:mm")
    }, 
    updateFilter(filterName, filterValue, selection) {
      if(filterName === "status"){
        this.statusFilterFirstLoad = false
        if(selection){
          this.filters[filterName].push(filterValue)
        }
        else{
          this.filters[filterName].splice(this.filters[filterName].indexOf(filterValue), 1)
        }
      }
      else {
        this.dateFilterFirstLoad = false
        this.filters[filterName] = filterValue
      }
      // update the url according to fiter(s)
      this.updateRoutingParams(this.activeFilters(this.filters), this.sortBy)
    },
    activeFilters(filters) {
      let activeFilters = {}
      for (const key in filters){
        if((key === "status" && filters[key] != []) || (key !== "status" && filters[key] !== "")){
          activeFilters[key] = filters[key]
        }
      }
      return activeFilters
    },
    loadSortingFromURL() {
      this.sortBy.sortColumn = this.$route.query.sortColumn
    },
    loadActiveFiltersFromURL() {
      for (const [param, value] of Object.entries(this.$route.query)) {

        if (param === "status") {
          this.statusFilterFirstLoad = false
          const statusArray = [
            NEGOTIATION_STATUS.SUBMITTED,
            NEGOTIATION_STATUS.IN_PROGRESS,
            NEGOTIATION_STATUS.ABANDONED,
          ]
          if (typeof value === "string") {
            this.filters["status"].push(value)
            if (statusArray.includes(value)) {
              this.submittedSelection = value === NEGOTIATION_STATUS.SUBMITTED
              this.ongoingSelection = value === NEGOTIATION_STATUS.IN_PROGRESS
              this.abandonedSelection = value === NEGOTIATION_STATUS.ABANDONED
            }
          } else {
            for (const status of value) {
              this.filters["status"].push(status)
              if (statusArray.includes(status)) {
                this.submittedSelection = status === NEGOTIATION_STATUS.SUBMITTED || this.submittedSelection
                this.ongoingSelection = status === NEGOTIATION_STATUS.IN_PROGRESS || this.ongoingSelection
                this.abandonedSelection = status === NEGOTIATION_STATUS.ABANDONED || this.abandonedSelection
              }
            }
          }
        }
        if (param === "dateStart" || param === "dateEnd") {
          this.dateFilterFirstLoad = false
          this.filters[param] = value
          this.selectedStartDate = param === "dateStart" ? value : this.selectedStartDate
          this.selectedEndDate = param === "dateEnd" ? value : this.selectedEndDate
        }
      }
    },
    updateRoutingParams(filters, sortBy){
      let query = {}
      Object.assign(query, filters, sortBy)
      this.$router.replace({ query })
    },
    clearAllFilters(){
      this.filters = {
        status: [],
        dateStart: "",
        dateEnd: ""
      }
      this.selectedStartDate = ""
      this.selectedEndDate = ""
    },
    isChecked(value){
      return this.sortBy.sortColumn === value ? true : false
    }
  }  
}
</script>
