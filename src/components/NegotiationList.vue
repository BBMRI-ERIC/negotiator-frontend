<template>
  <header>
    <h3>
      List of your Negotiations:
    </h3>
  </header>
    <div class="float-child">
    <table id="tableComponent" class="table table-hover styled-table">
        <thead>
        <tr>
            <th  v-for="field in headers" :key='field' >
                {{field}}
            </th>
            <th/>
        </tr>
        </thead>
        <tbody v-for="item in negotiations" :key='item'>
        <tr class="active-row">
            <td>{{ item.id }}</td>
            <td>{{ item.payload.project.title }}</td>
            <td>{{ item.status }}</td>
            <td>
                <span style="white-space: pre">
                    <button type="button" class="editButton" @click="interactModal(item)">
                        <font-awesome-icon icon="fa-pencil" />
                    Interact
                </button>
                <button class="abandonButton" @click="abandonRequest">
                    <font-awesome-icon icon="fa fa-trash"></font-awesome-icon>
                    Abandon
                </button>
                </span>
            </td>
        </tr>
        </tbody>
    </table>
    </div>
    <div class="float-child">
        <h6 class="bg-light p-2 border-top border-bottom filter-header">Filter</h6>
        <ul class="list-group border-2">
            <li class="list-group-item list-group-item-action">All <span class="badge badge-primary rounded-pill">2</span></li>
            <li class="list-group-item list-group-item-action">Year 2022 <span class="badge badge-primary rounded-pill">0</span></li>
            <li class="list-group-item list-group-item-action">Accepted <span class="badge badge-primary rounded-pill">0</span></li>
        </ul>
    </div>
    <div v-if="showModal" class="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title" id="exampleModalLabel">{{ negotiation.payload.project.title }}</h1>
                </div>
                <div class="modal-body">
                    {{ negotiation.payload }}
                    {{ negotiation.status }}
                </div>
                <div class="modal-body">
                    <label for="actions">Respond:</label>
                    <select v-model="selectedItem">
                        <option v-for="response in response_options" :value="response">{{ response }}</option>
                    </select>
                    <p>Selected item: {{ selectedItem }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="showModal = false">Close</button>
                    <button type="button" class="btn btn-primary" @click="updateNegotiation">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {mapActions} from "vuex";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "NegotiationsList",
    components: {FontAwesomeIcon},
  props: {
    negotiations: Array
  },
    data() {
        return {
            headers: [
                "id",
                "title",
                "status"
            ],
            showModal: false,
            negotiation: null,
            response_options: [],
            selectedItem: ''
        }
    },
    methods: {
        ...mapActions(["updateNegotiationStatus", "retrievePossibleEvents"]),
        async updateNegotiation() {
            await this.updateNegotiationStatus({
                negotiationId: this.negotiation.id,
                event: this.selectedItem
            });
            this.showModal = false
        },
        interactModal(negotiation){
            this.showModal = true;
            this.negotiation = negotiation;
            this.loadPossibleEvents();

        },
        loadPossibleEvents(){
            this.retrievePossibleEvents({
                negotiationId: this.negotiation.id
            }).then(data => {
                this.response_options = data;
            })
        },
      abandonRequest() {
            if(confirm("Are you sure you want to abandon this request?")) {
                console.log("deleting")
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/bbmri";

.editButton {background-color: $primary; border: none} /* Blue */
.abandonButton {background-color: $danger ;border: none} /* Red */
.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 700px;
    box-shadow: 0 0 20px $black;
}
.filter-header {
    margin-top: 25px;
    background-color: $light;
    color: $black;
    text-transform: uppercase;
}
.styled-table thead tr {
    background-color: $light;
    color: $black;
    text-transform: uppercase;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}
.styled-table tbody tr {
    border-bottom: 1px solid $light;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: $light;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid $light;
}
.styled-table tbody tr.active-row {
    font-weight: bold;
    color: #343a40;
}
.float-child {
    float: right;
    padding: 10px;
    width: auto;
}
.list-group {
    min-width: 200px;
    width: auto;
    border-collapse: collapse;
    border: $black 1px;
}
.badge {
    vertical-align: middle;
    horiz-align: center;
}
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
    background-color: $light;
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
    color: $black;
    text-decoration: none;
    cursor: pointer;
}

</style>