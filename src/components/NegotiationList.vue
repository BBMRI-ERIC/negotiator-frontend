<template>
  <div
    class="px-3 pt-1 header-bar card sticky-top border-0 shadow-sm"
    style="top: 50px"
  >
    <div class="row mb-2">
      <div class="col-12">
        <div class="dropdown b-dropdown mx-2 filter-dropdown position-static btn-group">
          <button
            id="dropdownMenuButton1"
            aria-haspopup="true"
            :class="getSortClass()"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Sort by 
          </button>
          <ul
            class="dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
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
                @change="sort($event.target.value)"
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
        <!--div class="card mb-2">
        <div class="card-header">
          Sort by
        </div>
        <div class="card-body">
          <div
            v-for="(value, name) in sortAttrs"
            :key="name"
            class="form-check"
          >
            <input
              :id="name"
              class="form-check-input"
              type="radio"
              name="sort"
              :value="name"
              @change="sort($event.target.value)"
            >
            <label
              class="form-check-label"
              :for="name"
            >
              {{ value.label }}
            </label>
          </div>
        </div>
      </div--> 
    
  
        <div class="dropdown b-dropdown mx-2 filter-dropdown position-static btn-group">
          <button
            id="dropdownMenuButton1"
            aria-haspopup="true"
            :class=" filters.status.length >0 ? 'btn dropdown-toggle btn-secondary' : 'btn dropdown-toggle btn-outline-secondary'"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by status 
            <span
              v-if="filters.status.length > 0"
              class="badge bg-primary border ml-2"
            > {{ filters.status.length }}</span>
          </button>
          <ul
            class="dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
          >
            <div class="mx-2 my-2">
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
        <!--div class="card mb-2">
        <div class="card-header">
          Filter by status
        </div>
        <div class="card-body">
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
      </div!--> 
   
    
        <div class="dropdown b-dropdown mx-2 filter-dropdown position-static btn-group">
          <button
            id="dropdownMenuButton1"
            aria-haspopup="true"
            :class=" filters.dateStart != '' || filters.dateEnd != '' ? 'btn dropdown-toggle btn-secondary' : 'btn dropdown-toggle btn-outline-secondary'"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Filter by Date
            <span
              v-if="filters.dateStart != '' || filters.dateEnd != ''"
              class="badge bg-primary border ml-2"
            > {{ computeDateFilterLength() }}</span>
          </button>
          <ul
            class="dropdown-menu"
            aria-labelledby="dropdownMenuButton1"
          >
            <div class="mx-2 my-2">
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
      <!--div class="card">
        <div class="card-header">
          Filter by date
        </div>
        <div class="card-body">
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
      </div-->
      </div>
    </div>
  </div>
  <hr class="my-4">
  <div class="container">
    <div class="row">
      <div
        class="col-9"
      >
        <NegotiationCard
          v-for="fn in filteredNegotiations"
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
          v-if="negotiations.length == 0"
          class="text-center"
        >
          No Negotiations found
        </h2>
      </div>
      <!--div
        class="col-3"
      >
        <div class="card mb-2">
          <div class="card-header">
            Sort by
          </div>
          <div class="card-body">
            <div
              v-for="(value, name) in sortAttrs"
              :key="name"
              class="form-check"
            >
              <input
                :id="name"
                class="form-check-input"
                type="radio"
                name="sort"
                :value="name"
                @change="sort($event.target.value)"
              >
              <label
                class="form-check-label"
                :for="name"
              >
                {{ value.label }}
              </label>
            </div>
          </div>
        </div>  
        <div class="card mb-2">
          <div class="card-header">
            Filter by status
          </div>
          <div class="card-body">
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
        </div>  
        <div class="card">
          <div class="card-header">
            Filter by date
          </div>
          <div class="card-body">
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
        </div>
      </div-->
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
      default() {
        return []
      }
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
        "title": {
          label: "Title",
          sortTransformation: (value) => value.payload.project.title,
          sortOrder: "asc"
        },
        "status": {
          label: "Status",
          sortTransformation: (value) => value.status,
          sortOrder: "asc"
        },
        "creationDate": {
          label: "Date of creation",
          sortTransformation: (value) => new Date(value.creationDate),
          sortOrder: "desc"
        } 
      },      
      filters: {
        "status": [],
        "dateStart": "",
        "dateEnd": ""
      },
      sortBy: { "sortColumn": undefined }
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
      return filterConditions.length == 0 ? this.negotiations : this.negotiations.filter(item => filterConditions.every(f => f(item)))
    }
  },
  beforeMount(){
    this.loadActiveFiltersandSortingFromURL()
    
  },
  beforeUpdate(){
    this.loadSortingFromURL()
  },
  methods: {
    sort(column){
      this.sortBy.sortColumn = column
      this.updateRoutingParams(this.activeFilters(this.filters), this.sortBy)
      
      let sortedNegotiations = this.negotiations
      console.log(sortedNegotiations)

      return sortedNegotiations.sort((a, b) => {
        a = this.sortAttrs[column].sortTransformation(a)
        b = this.sortAttrs[column].sortTransformation(b)
        if (a < b) {
          return this.sortAttrs[column].sortOrder == "desc" ? 1 : -1
        }
        if (a > b) {
          return this.sortAttrs[column].sortOrder == "desc" ? -1 : 1 
        }
        return 0
      })
    },
    formatDate(date){
      return moment(date).format("YYYY/MM/DD HH:mm")
    }, 
    updateFilter(filterName, filterValue, selection){
      if(filterName == "status"){
        if(selection){
          this.filters[filterName].push(filterValue)
        }
        else{
          this.filters[filterName].splice(this.filters[filterName].indexOf(filterValue), 1)
        }
      }
      else {
        this.filters[filterName] = filterValue
      }
      // update the url according to fiter(s)
      //const destinationPage = this.userRole == ROLES.REPRESENTATIVE ? "biobanker" : "researcher" 
      //this.$router.push({ path: "/"+ destinationPage, query: this.activeFilters(this.filters) })
      this.updateRoutingParams(this.activeFilters(this.filters), this.sortBy)
      // Reload the page
      // window.location.reload()
    },
    activeFilters(filters){
      let activeFilters = {}
      for (const key in filters){
        if((key == "status" && filters[key] != []) || (key != "status" && filters[key] != "")){
          activeFilters[key] = filters[key]
        }
      }
      return activeFilters
    },
    loadSortingFromURL(){
      for (const [param, value] of Object.entries(this.$route.query)) {
        if (param == "sortColumn"){
          this.sort(value)
        }
      }
    },
    loadActiveFiltersandSortingFromURL(){
      for (const [param, value] of Object.entries(this.$route.query)) {

        if (param === "status") {
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
          this.filters[param] = value
          this.selectedStartDate = param === "dateStart" ? value : this.selectedStartDate
          this.selectedEndDate = param === "dateEnd" ? value : this.selectedEndDate
        }
      }
    }, 
    getSortClass(){
      return this.sortBy.sortColumn != undefined ? "btn dropdown-toggle btn-secondary" : "btn dropdown-toggle btn-outline-secondary "
    },
    updateRoutingParams(filters, sortBy){
      let query = {}
      Object.assign(query, filters, sortBy)
      const destinationPage = this.userRole == ROLES.REPRESENTATIVE ? "biobanker" : "researcher" 
      this.$router.push({ path: "/"+ destinationPage, query: query })


    },
    computeDateFilterLength(){
      if(this.filters.dateStart != "" && this.filters.dateEnd != ""){
        return 2
      }
      return 1
    }

  }


  
}
</script>
