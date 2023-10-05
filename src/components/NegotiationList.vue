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
            :id="item.id"
            :key="item.id"
            :title="item.payload.project.title"
            :status="item.status"
            :resources="['res1', 'res2', 'res3']"
            :submitter="item.persons[0].name"
            :creation-date="formatDate(item.creationDate)"
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
    sort(column){
      let sortedNegotiations = this.negotiations

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
    }
  }
  
}
</script>
