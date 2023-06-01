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
                Year 2022
                <span class="badge bg-primary rounded-pill float-end">0</span>
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
          class="table table-hover"
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
              <th />
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
              <!--tr v-for="item in negotiations" :key="item.id"-->
              <!--router-link :to="{ name: 'negotiation', params: { negotiationId: item.id } }"-->
              <!--router-link v-for="item in negotiations" :key=item.id :to= "`/negotiations/${item.id}`" v-slot="{tr}" custom-->
              <td class="col-3">
                {{ item.id }}
              </td>
              <td class="col-5 col-xxl-4">
                {{ item.payload.project.title }}
              </td>
              <td class="col-2">
                {{ item.status }}
              </td>
              <td class="col-2 col-xxl-3">
                <!--span
                    class="badge bg-primary rounded-pill"
                    >{{this.unreadMessages}} To read </span
                -->
                <button
                  v-if="userRole == availableRoles.REPRESENTATIVE && item.status == 'SUBMITTED'"
                  type="button"
                  class="btn btn-secondary btn-sm me-2 mb-1"
                  @click.stop="interactModal(item)"
                >
                  <font-awesome-icon
                    icon="fa fa-pencil"
                    fixed-width
                  />
                  <span class="d-none d-xxl-inline-block ms-1">Interact</span>
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm mb-1"
                  @click.stop="abandonRequest"
                >
                  <font-awesome-icon
                    icon="fa fa-trash"
                    fixed-width
                  />
                  <span class="d-none d-xxl-inline-block ms-1">Abandon</span>
                </button>
              </td>
              <!--/router-link-->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div
    v-if="showModal"
    class="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title">
            {{ negotiation.payload.project.title }}
          </h1>
        </div>
        <div class="modal-body">
          <span>Data: {{ negotiation.payload }}</span>
          <span>Status: {{ negotiation.status }}</span>
        </div>
        <div class="modal-body">
          <label for="actions">Respond:</label>
          <select v-model="selectedItem">
            <option
              v-for="response in responseOptions"
              :key="response"
              :value="response"
            >
              {{ response }}
            </option>
          </select>
          <p>Selected item: {{ selectedItem }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-danger"
            @click="showModal = false"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="updateNegotiation"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { ROLES } from "@/config/consts"

export default {
  name: "NegotiationsList",
  components: { FontAwesomeIcon },
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
      showModal: false,
      negotiation: [],
      responseOptions: [],
      selectedItem: "",
      unreadMessages: 0,
      availableRoles: ROLES
    }
  },
  mounted() {
    console.log(this.availableRoles)
    console.log(this.userRole)
  },
  methods: {
    ...mapActions(["updateNegotiationStatus", "retrievePossibleEvents", "getUnreadMessagesByRole"]),
    async updateNegotiation() {
      await this.updateNegotiationStatus({
        negotiationId: this.negotiation.id,
        event: this.selectedItem,
      })
      this.showModal = false
    },
    interactModal(negotiation) {
      this.showModal = true
      this.negotiation = negotiation
      this.loadPossibleEvents()
    },
    loadPossibleEvents() {
      this.retrievePossibleEvents({
        negotiationId: this.negotiation.id,
      }).then((data) => {
        this.responseOptions = data
      })
    },
    abandonRequest() {
      if (confirm("Are you sure you want to abandon this request?")) {
        console.log("deleting")
      }
    },
    getUnreadMessages(negotiationId, roleName) {
      this.getUnreadMessagesByRole({
        data: {
          negotiationId: negotiationId,
          roleName: roleName
        },
      }).then((data) => {
        if (data) {
          return data.length
        }
      })
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
</style>