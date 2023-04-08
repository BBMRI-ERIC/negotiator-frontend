<template>
  <header>
    <h3>
      List of your ongoing negotiations:
    </h3>
  </header>
    <table id="tableComponent" class="table table-bordered table-striped">
        <thead>
        <tr>
            <!-- loop through each value of the fields to get the table header -->
            <th  v-for="field in headers" :key='field' @click="sortTable(field)" >
                {{field}} <i class="bi bi-sort-alpha-down" aria-label='Sort Icon'></i>
            </th>
        </tr>
        </thead>
        <tbody>
        <!-- Loop through the list get the each student data -->
        <tr v-for="item in negotiations" :key='item'>
            <td v-for="field in headers" :key='field'>{{item[field]}}</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import Negotiation from "@/components/Negotiation.vue";
import {ref} from "vue";
export default {
  name: "NegotiationsList",
  props: {
    negotiations: Array
  },
    data() {
        return {
            headers: [
                "id",
                "title",
                "description"
            ]
        }
    }
  ,
  components: {
    Negotiation
  }
}


</script>

<style scoped>

</style>