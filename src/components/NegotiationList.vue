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
              >
                <span class="text-uppercase">{{ field }}</span>
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
      availableRoles: ROLES
    }
  },
  methods: {
    abandonRequest() {
      if (confirm("Are you sure you want to abandon this request?")) {
        console.log("deleting")
      }
    },
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
</style>