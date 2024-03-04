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
  data () {
    return {
      negotiations: undefined,
      pagination: undefined,
      user: undefined,
      userId: undefined,
      roles: []
    }
  },
  async mounted () {
    this.user = await await this.retrieveUser()
    this.userId = this.user.users[0].id

    if (this.userRole === "ROLE_ADMIN") { this.negotiations = await this.retrieveNegotiations({ statusFilter: "SUBMITTED", pageNumber: 0 }) }

    if (this.userRole === "ROLE_RESEARCHER") { this.negotiations = await this.retrieveNegotiationsByRole({ role: "author", userId: this.userId, pageNumber: 0 }) }

    if (this.userRole === "ROLE_REPRESENTATIVE") { this.negotiations = await this.retrieveNegotiationsByRole({ role: "representative", userId: this.userId, pageNumber: 0 }) }

    this.pagination = this.negotiations.page
    if (this.negotiations.page.totalElements === 0) {
      this.negotiations = {}
    } else {
      this.negotiations = this.negotiations._embedded.negotiations
    }
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByRole", "retrieveNegotiations", "retrieveUser", "retrieveUserRoles"]),
    async retrieveNegotiationsByPage (currentPageNumber) {
      if (this.userRole === "ROLE_ADMIN") { this.negotiations = await this.retrieveNegotiations({ statusFilter: "SUBMITTED", pageNumber: currentPageNumber - 1 }) }

      if (this.userRole === "ROLE_RESEARCHER") { this.negotiations = await this.retrieveNegotiationsByRole({ role: "author", userId: this.userId, pageNumber: currentPageNumber - 1 }) }

      if (this.userRole === "ROLE_REPRESENTATIVE") { this.negotiations = await this.retrieveNegotiationsByRole({ role: "representative", userId: this.userId, pageNumber: currentPageNumber - 1 }) }

      // this.negotiations = await this.retrieveNegotiationsByRole({ userId: this.userId, pageNumber: currentPageNumber })
      if (this.negotiations._embedded) { this.negotiations = this.negotiations._embedded.negotiations }
    },
    async retrieveNegotiationsByFilterStatus (filterStatus) {
      this.negotiations = await this.retrieveNegotiationsByRole({ userId: this.userId, pageNumber: 0, statusFilter: filterStatus })
      if (this.negotiations._embedded) { this.negotiations = this.negotiations._embedded.negotiations }
    }
  }
}
</script>
