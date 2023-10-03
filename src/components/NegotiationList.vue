<template>
  <hr class="my-4">
  <div class="container">
    <div class="row">
      <div
        class="col-9 d-flex justify-content-center"
      >
        <div
          v-if="negotiations.length > 0"
          class="col-12"
        >
          <NegotiationCard
            v-for="item in filteredNegotiations"
            :key="item.id"
            :negotiation-id="item.id"
            :negotiation-title="item.payload.project.title"
            :negotiation-status="item.status"
            :negotiation-resources="['res1', 'res2', 'res3']"
            :negotiation-submitter="item.persons[0].name"
            :negotiation-creation-date="formatDate(item.creationDate)"
            class="cursor-pointer"
            @click="
              $router.push({
                name: 'negotiation-page',
                params: { negotiationId: item.id, userRole: userRole },
              })
            "
          />
        </div>
        <div
          v-else
        >
          <h2 class="text-center">
            No Negotiations found
          </h2>
        </div>
      </div>
      <div
        class="
          col-3"
      >
        <div class="card mb-2">
          <div class="card-header">
            Sort by
          </div>
          <div class="card-body">
            <div class="form-check">
              <input
                id="title"
                class="form-check-input"
                type="radio"
                name="sort"
                value="title"
                @change="sort($event.target.value)"
              >
              <label
                class="form-check-label"
                for="title"
              >
                Title
              </label>
            </div>
            <div class="form-check">
              <input
                id="status"
                class="form-check-input"
                type="radio"
                name="sort"
                value="status"
                @change="sort($event.target.value)"
              >
              <label
                class="form-check-label"
                for="status"
              >
                Status 
              </label>
            </div>
            <div class="form-check">
              <input
                id="creationDate"
                class="form-check-input"
                type="radio"
                name="sort"
                value="creationDate"
                @change="sort($event.target.value)"
              >
              <label
                class="form-check-label"
                for="creationDate"
              >
                Date of creation
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
                SUBMITTED
              </label>
            </div>
            <div class="form-check">
              <input
                id="ongoing"
                v-model="ongoingSelection"
                class="form-check-input"
                type="checkbox"
                value="ongoing"
                @change="updateFilter('status', 'ONGOING', ongoingSelection)"
              >
              <label
                class="form-check-label"
                for="ongoing"
              >
                ONGOING
              </label>
            </div>
            <div class="form-check">
              <input
                id="aborted"
                v-model="abortedSelection"
                class="form-check-input"
                type="checkbox"
                value="aborted"
                @change="updateFilter('status', 'ABORTED', abortedSelection)"
              >
              <label
                class="form-check-label"
                for="aborted"
              >
                ABORTED
              </label>
            </div>
          </div>
        </div>  
        <div class="card">
          <div class="card-header">
            Filter by date
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center  mb-2">
              <label for="startDate">Start: </label>
              <input
                id="startDate"
                v-model="selectedStartDate"
                class="form-control"
                type="date"
                @input="updateFilter('dateStart', selectedStartDate)"
              >
              <span id="startDateSelected" />
            </div>
            <div class="d-flex align-items-center">
              <label for="endDate">End:</label>
              <input
                id="endDate"
                v-model="selectedEndDate"
                class="form-control"
                type="date"
                @input="updateFilter('dateEnd', selectedEndDate)"
              >
              <span id="endDateSelected" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NegotiationCard from "@/components/NegotiationCard.vue"
import { ROLES } from "@/config/consts"
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
      headers: ["id", "title", "status"],
      negotiation: [],
      availableRoles: ROLES,
      sorting: { "id": {
        "func": this.sortById, 
        "order": "asc"
      }, 
      "title": {
        "func": this.sortByTitle, 
        "order": "asc"
      }, 
      "status": {
        "func": this.sortByStatus, 
        "order": "asc"
      }, 
      "creationDate": {
        "func": this.sortByCreationDate, 
        "order": "desc"
      }, 
      }, 
      previuosSortingColumn: "", 
      filters: {
        "status": [],
        "dateStart": "",
        "dateEnd": ""
      },
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
  methods: {
    abandonRequest() {
      if (confirm("Are you sure you want to abandon this request?")) {
        console.log("deleting")
      }
    },
    sortByTitle(a, b) {
      if (a.payload.project.title < b.payload.project.title) {
        return this.sorting.title.order == "desc" ? 1 : -1
      }
      if (a.payload.project.title > b.payload.project.title) {
        return this.sorting.title.order == "desc" ? -1 : 1 
      }
      return 0
    },
    sortById(a, b) {
      if (a.id < b.id) {
        return this.sorting.id.order == "desc" ? 1 : -1
      }
      if (a.id > b.id) {
        return this.sorting.id.order == "desc" ? -1 : 1 
      }
      return 0
    },
    sortByStatus(a, b) {
      if (a.status < b.status) {
        return this.sorting.status.order == "desc" ? 1 : -1
      }
      if (a.status > b.status) {
        return this.sorting.status.order == "desc" ? -1 : 1 
      }
      return 0
    },

    sortByCreationDate(a, b){
      const dateA = new Date(a.creationDate)
      const dateB = new Date(b.creationDate)
      return this.sorting.creationDate.order == "desc" ? dateB-dateA : dateA-dateB

    },

    sort(column){
      let sortedNegotiations = this.negotiations
      return sortedNegotiations.sort(this.sorting[column]["func"])
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
    }
  }
  
}
</script>
