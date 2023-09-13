<template>
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
</template>

<script>
import { ROLES } from "@/config/consts"

export default {
  name: "NegotiationsList",
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
        "func": this.compareById, 
        "order": ""
      }, 
      "title": {
        "func": this.compareByTitle, 
        "order": ""
      }, 
      "status": {
        "func": this.compareByTitle, 
        "order": ""
      }, 
      }, 
      previuosSortingColumn: ""
    }
  },
  methods: {
    abandonRequest() {
      if (confirm("Are you sure you want to abandon this request?")) {
        console.log("deleting")
      }
    },
    compareByTitle(a, b) {
      console.log("called")
      if (a.payload.project.title < b.payload.project.title) {
        return this.sorting.title.order == "desc" ? 1 : -1
      }
      if (a.payload.project.title > b.payload.project.title) {
        return this.sorting.title.order == "desc" ? -1 : 1 
      }
      return 0
    },
    compareById(a, b) {
      
      if (a.id < b.id) {
        return this.sorting.id.order == "desc" ? 1 : -1
      }
      if (a.id > b.id) {
        return this.sorting.id.order == "desc" ? -1 : 1 
      }
      return 0
    },
    sort(column){
      if(this.previuosSortingColumn!= "" &&  this.previuosSortingColumn!= column){
        // change of sorting column, reset the order of the previous one 
        this.sorting[this.previuosSortingColumn].order = ""
      }
      if (this.sorting[column].order == "" || this.sorting[column].order == "desc"){
        this.sorting[column].order = "asc"
      }
      else{
        this.sorting[column].order = "desc"
      }
      let sortedNegotiations = this.negotiations

      this.previuosSortingColumn = column 
      return sortedNegotiations.sort(this.sorting[column]["func"])
    }
  }, 
  
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