<template>
  <div class="container">
    <div class="row">
      <div class="col-md-2 w-25">
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
        <!--select name="sorting" @change="sort($event.target.value)" class="form-select form-control">
          <option>---- Sort by  ----</option>
          <option value="title">Title</option>
          <option value="id">Identifier</option>
          <option value="creationDate">Creation Date </option>
          <option value="status">Status </option>
        </select!--> 
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
                @input="updateFilter('startDate', selectedStartDate)"
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
                @input="updateFilter('endDate', selectedEndDate)"
              >
              <span id="endDateSelected" />
            </div>
          </div>
        </div>              
      </div>
      <div class="col">
        <div
          v-for="item in filteredNegotiations"
          :key="item.id"
        >
          <NegotiationCard
            :negotiation-id="item.id"
            :negotiation-title="item.payload.project.title"
            :negotiation-status="item.status"
            :negotiation-resources="['res1', 'res2', 'res3']" 
            :negotiation-submitter="item.persons[0].name"
            :negotiation-creation-date="formatDate(item.creationDate)"
            @click="
              $router.push({
                name: 'negotiation-page',
                params: { negotiationId: item.id, userRole: userRole },
              })
            "
          />
        </div> 
      </div>
    </div>
  </div>
</template>

<!--template>
  <div class="container">
    <div class="row table-responsive d-flex">
      <div class="col-md-2">
        <table
          id="tableComponent"
          class="table table-hover"
        >
          <thead>
            <tr class="table-secondary">
              <th>FILTER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                All
                <span class="badge bg-primary rounded-pill float-end">{{
                  negotiations.length
                }}</span>
              </td>
            </tr>
            <tr>
              <td>
                Accepted
                <span class="badge bg-primary rounded-pill float-end">0</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-md-10">
        <table
          id="tableComponent"
          class="table table-hover negotiation-list-table"
        >
          <thead>
            <tr class="table-secondary">
              <th
                v-for="field in headers"
                :key="field"
                scope="col"
                @click="sort(field)"
              >
                <div>
                  <span class="text-uppercase">{{ field }}</span>

                  <span
                    v-if="sorting[field].order == 'asc'"
                    class="arrow asc"
                  />
                  <span
                    v-if="sorting[field].order == 'desc'"
                    class="arrow dsc"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="item in negotiations"
              :key="item.id"
              @click="
                $router.push({
                  name: 'negotiation-page',
                  params: { negotiationId: item.id, userRole: userRole },
                })
              "
            >
              <td class="col-3">
                {{ item.id }}
              </td>
              <td class="col-5 col-xxl-4">
                {{ item.payload.project.title }}
              </td>
              <td class="col-2">
                {{ item.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template-->

<script>
import { ROLES } from "@/config/consts"
import  NegotiationCard  from "@/components/NegotiationCard.vue"
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
      sorting : { "id": {
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
        "dateEnd" : ""
      },
    }
  }, 
  computed: {
    filteredNegotiations: function(){
      console.log("Computing filtered negotiations" )
      console.log(this.filters.status.length)
      let filterConditions = []
      if (this.filters.status.length > 0){
        filterConditions.push(item => this.filters["status"].includes(item.status))
      }
      if(this.filters.dateStart != ""){
        const startDate = new Date(this.filters["dateStart"])
        filterConditions.push(item => {
          const eventDate = new Date(item.date)
          return eventDate >= startDate
        })     
      }
      if(this.filters.dateEnd != ""){
        const endDate = new Date(this.filters["dateEnd"])
        filterConditions.push(item => {
          const eventDate = new Date(item.date)
          return eventDate <= endDate
        })     
      }

      return filterConditions.length == 0 ? this.negotiations : this.negotiations.filter(item => filterConditions.every(f => f(item)))


      //if (this.filters.status.length == 0 && this.filters.daterange.start == "" && this.filters.daterange.end == ""){
      //  console.log("no filters")
      //  return this.negotiations //no filters applied 
      //} 
      //else if(this.filters.status.length>0 && this.filters.daterange.start == "" && this.filters.daterange.end == ""){
      // only status filter is applied
      //  console.log("Filter applied")
      //  console.log(this.filters)
      //  console.log(this.negotiations)
      //return this.negotiations.filter(function(negotiation){
      // return negotiation.status === "ONGOING" //this.filters["status"]
      //return this.filters["status"].includes(negotiation.status)
      //  return this.negotiations.filter(item => this.filters["status"].includes(item.status))
    }
    


  },
  methods: {
    abandonRequest() {
      if (confirm("Are you sure you want to abandon this request?")) {
        console.log("deleting")
      }
    },
    sortByTitle(a, b) {
      console.log("called sort by title")
      if (a.payload.project.title < b.payload.project.title) {
        return this.sorting.title.order == "desc" ? 1 : -1
      }
      if (a.payload.project.title > b.payload.project.title) {
        return this.sorting.title.order == "desc" ? -1 : 1 
      }
      return 0
    },
    sortById(a, b) {
      console.log("called sort by Id")
      if (a.id < b.id) {
        return this.sorting.id.order == "desc" ? 1 : -1
      }
      if (a.id > b.id) {
        return this.sorting.id.order == "desc" ? -1 : 1 
      }
      return 0
    },
    sortByStatus(a, b) {
      console.log("called sort by status")
      if (a.status < b.status) {
        return this.sorting.status.order == "desc" ? 1 : -1
      }
      if (a.status > b.status) {
        return this.sorting.status.order == "desc" ? -1 : 1 
      }
      return 0
    },

    sortByCreationDate(a, b){
      console.log("called sort by creationDate")
      console.log(a.creationDate)
      console.log(b.creationDate)
      if (a.creationDate < b.creationDate) {
        return this.sorting.creationDate.order == "desc" ? a.creationDate.localeCompare(b.creationDate) :  b.creationDate.localeCompare(a.creationDate) 
      }
      if (a.creationDate > b.creationDate) {
        return this.sorting.creationDate.order == "desc" ? b.creationDate.localeCompare(a.creationDate) : a.creationDate.localeCompare(b.creationDate) 
      }
      return 0

    },

    sort(column){
      console.log(column)
      //if(this.previuosSortingColumn!= "" &&  this.previuosSortingColumn!= column){
      // change of sorting column, reset the order of the previous one 
      //  this.sorting[this.previuosSortingColumn].order = ""
      //}
      //if (this.sorting[column].order == "" || this.sorting[column].order == "desc"){
      //  this.sorting[column].order = "asc"
      // }
      //else{
      //  this.sorting[column].order = "desc"
      //}
      let sortedNegotiations = this.negotiations

      //this.previuosSortingColumn = column 
      return sortedNegotiations.sort(this.sorting[column]["func"])
    },
    formatDate(date){
      return moment(date).format("MM/DD/YYYY HH:mm")
    }, 
    updateFilter(filterName, filterValue, selection){
      console.log("Update of filter:"+filterName)
      console.log("for value:"+filterValue)
      console.log("selected:"+selection)

      if(filterName == "status"){
        if(selection){
          this.filters[filterName].push(filterValue)
        }
        else{
          console.log("removing value"+filterValue)
          this.filters[filterName].splice(this.filters[filterName].indexOf(filterValue), 1)
        }
      

      }
      else {
        this.filters.filterName = filterValue
      }
      
      console.log(this.filters)
      //let filteredNegotiations = this.negotiations.filter(function(negotiation){
      //  return negotiation.status === "ONGOING" //this.filters["status"]
      //})
      //console.log("Filtered")
      //console.log(filteredNegotiations)
      //return filteredNegotiations
    }
  }
  
}
</script>

<style scoped>
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.modal-title {
  font-size: large;
}
.modal-content {
  background-color: "$light";
  margin: 15% auto;
  padding: 20px;
  border: 1px solid gray;
  width: 80%;
}
.close {
  color: gray;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close:hover,
.close:focus {
  color: "$black";
  text-decoration: none;
  cursor: pointer;
}
.negotiation-list-table tbody tr:hover > td {
    cursor: pointer;
}
.arrow.asc {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #000402;
}

.arrow.dsc {
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 10px solid #000000;
}

</style>