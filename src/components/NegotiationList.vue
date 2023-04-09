<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
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
            <td v-for="field in headers" :key='field'>{{item[field]}}</td>
            <td>
                <span style="white-space: pre">
                    <button type="button" class="editButton" data-bs-toggle="modal" data-bs-target="#exampleModal" com>
                        <i class="fa fa-pencil"></i>
                    Edit
                </button>
                <button class="abandonButton" @click="abandonRequest">
                    <i class="fa fa-trash"></i>
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
    <negotiation-modal id="exampleModal"/>
</template>

<script>
import NegotiationModal from "@/components/NegotiationModal.vue";

export default {
  name: "NegotiationsList",
    components: {NegotiationModal},
  props: {
    negotiations: Array
  },
    data() {
        return {
            headers: [
                "id",
                "title"
            ],
            show: false
        }
    },
    methods: {
      abandonRequest() {
            if(confirm("Are you sure you want to abandon this request?")) {
                console.log("deleting")
            }
        }
    }
}
</script>

<style scoped>

.editButton {background-color: #008CBA; border: none} /* Blue */
.abandonButton {background-color: #f44336;border: none} /* Red */
.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 700px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.filter-header {
    margin-top: 25px;
    background-color: #dee2e6;
    color: black;
    text-transform: uppercase;
}
.styled-table thead tr {
    background-color: #dee2e6;
    color: black;
    text-transform: uppercase;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}
.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #dee2e6;
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
    border: black 1px;
}
.badge {
    vertical-align: middle;
    horiz-align: center;
}

</style>