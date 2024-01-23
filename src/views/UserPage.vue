<template>
  <NegotiationList 
    :negotiations="negotiations"
    :pagination="pagination"
    :user-role="userRole"
    @currentPageNumber="retrieveNegotiationsByPage"
    @filterStatus="retrieveNegotiationsByFilterStatus"
  />
</template>
<script>

import NegotiationList from "@/components/NegotiationList.vue"
import { mapActions } from "vuex"
import { ROLES } from "@/config/consts.js"

export default {
  components: {
    NegotiationList
  },
    
  props: {
    userRole: {
      type: String,
      required: true,
      validator: function (value) {
        return [ROLES.RESEARCHER, ROLES.REPRESENTATIVE, ROLES.ADMINISTRATOR].includes(value)
      }
    }
  },
  data() {
    return {
      negotiations: undefined,
      pagination: undefined,
      user: undefined,
      userId: undefined,
      roles: []
    }
  },
  async mounted() {
    this.user = await await this.retrieveUser()
    this.userId = this.user._embedded.userResponseModelList[0].id;
    this.negotiations = await this.retrieveNegotiationsByRole({ userId: this.userId, pageNumber: 0 })
    this.pagination = this.negotiations.page

    this.negotiations = this.negotiations._embedded.negotiationDTOList
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByRole","retrieveUser", "retrieveUserRoles"]),
    async retrieveNegotiationsByPage(currentPageNumber) {
      this.negotiations = await this.retrieveNegotiationsByRole({ userId: this.userId, pageNumber: currentPageNumber })
      this.negotiations = this.negotiations._embedded.negotiationDTOList
    },
    async retrieveNegotiationsByFilterStatus(filterStatus) {
      this.negotiations = await this.retrieveNegotiationsByRole({ userId: this.userId, pageNumber: 0, statusFilter: filterStatus})
      this.negotiations = this.negotiations._embedded.negotiationDTOList
    },
  }
}
</script>