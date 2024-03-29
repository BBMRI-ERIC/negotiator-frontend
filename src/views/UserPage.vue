<template>
  <NegotiationList
    :negotiations="negotiations"
    :pagination="pagination"
    :user-role="userRole"
    @current-page-number="retrieveNegotiationsByPage"
    @filters-sort-data="retrieveNegotiationsBySortAndFilter"
  />
  <Pagination
    :negotiations="negotiations"
    :pagination="pagination"
    @current-page-number="retrieveNegotiationsByPage"
  />
</template>

<script>

import NegotiationList from "@/components/NegotiationList.vue"
import Pagination from "@/components/Pagination.vue"
import { mapActions } from "vuex"
import { ROLES } from "@/config/consts.js"

export default {
  components: {
    NegotiationList,
    Pagination
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
      roles: [],
      filtersSortData: {
        status: [],
        dateStart: "",
        dateEnd: "",
        sortBy: "",
        sortDirection: "DESC"
      }
    }
  },
  async mounted () {
    this.user = await this.retrieveUser()
    this.userId = this.user.users[0].id

    this.retrieveNegotiationsByUserRole(0)
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByUserId", "retrieveNegotiations", "retrieveUser", "retrieveUserRoles"]),
    async retrieveNegotiationsByUserRole (pageNumber) {
      if (this.userRole === "ROLE_ADMIN") {
        this.filtersSortData.status = ["SUBMITTED"]
        this.negotiations = await this.retrieveNegotiations({ filtersSortData: this.filtersSortData, pageNumber })
      }

      if (this.userRole === "ROLE_RESEARCHER") {
        this.negotiations = await this.retrieveNegotiationsByUserId({ role: "author", filtersSortData: this.filtersSortData, userId: this.userId, pageNumber })
      }

      if (this.userRole === "ROLE_REPRESENTATIVE") {
        this.filtersSortData.status = ["IN_PROGRESS", "ABANDONED"]
        this.negotiations = await this.retrieveNegotiationsByUserId({ role: "representative", filtersSortData: this.filtersSortData, userId: this.userId, pageNumber })
      }

      this.pagination = this.negotiations.page
      if (this.negotiations.page.totalElements === 0) {
        this.negotiations = {}
      } else {
        this.negotiations = this.negotiations._embedded.negotiations
      }
    },
    retrieveNegotiationsByPage (currentPageNumber) {
      this.retrieveNegotiationsByUserRole(currentPageNumber - 1)
    },
    retrieveNegotiationsBySortAndFilter (filtersSortData) {
      this.filtersSortData = filtersSortData

      this.retrieveNegotiationsByUserRole(0)
    }
  }
}
</script>
