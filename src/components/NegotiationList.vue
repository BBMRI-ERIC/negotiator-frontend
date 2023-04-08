<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <header>
    <h3>
      List of your Negotiations:
    </h3>
  </header>
    <table id="tableComponent" class="table table-hover">
        <thead>
        <tr>
            <th  v-for="field in headers" :key='field' >
                {{field}}
            </th>
        </tr>
        </thead>
        <tbody v-for="item in negotiations" :key='item'>
        <tr>
            <td v-for="field in headers" :key='field'>{{item[field]}}</td>
            <td>
                <span style="white-space: pre">
                    <button type="button" class="editButton" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fa fa-pencil"></i>
                    Edit
                </button>
                <button class="abandonButton">
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
    }
}
</script>

<style scoped>

.editButton {background-color: #008CBA; border: none} /* Blue */
.abandonButton {background-color: #f44336;border: none} /* Red */

</style>