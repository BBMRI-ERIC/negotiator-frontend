<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <header>
    <h3>
      List of your Negotiations:
    </h3>
  </header>
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
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
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

</style>