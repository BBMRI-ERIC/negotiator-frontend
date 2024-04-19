<template>
  <FilterSort
    v-if="!loading"
    :filters-sort-data="filtersSortData"
    :user-role="userRole"
    :filters-status="filtersStatus"
    @filters-sort-data="retrieveNegotiationsBySortAndFilter"
  />
  <NegotiationList
    :negotiations="negotiations"
    :pagination="pagination"
    :user-role="userRole"
    :filters-sort-data="filtersSortData"
    @filters-sort-data="retrieveNegotiationsBySortAndFilter"
  />
  <NegotiationPagination
    :negotiations="negotiations"
    :pagination="pagination"
    @current-page-number="retrieveNegotiationsByPage"
  />
</template>

<script>
import moment from "moment"
import NegotiationList from "@/components/NegotiationList.vue"
import NegotiationPagination from "@/components/NegotiationPagination.vue"
import FilterSort from "@/components/FilterSort.vue"

import { mapActions } from "vuex"
import { ROLES } from "@/config/consts.js"

export default {
  components: {
    NegotiationList,
    NegotiationPagination,
    FilterSort
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
      filtersStatus: [],
      filtersSortData: {
        status: [],
        dateStart: "",
        dateEnd: "",
        sortBy: "creationDate",
        sortDirection: "DESC"
      }
    }
  },
  computed: {
    loading () {
      return this.negotiations === undefined
    }
  },
  async mounted () {
    this.user = await this.retrieveUser()
    this.userId = this.user.users[0].id

    if (this.userRole === "ROLE_REPRESENTATIVE") {
      this.filtersStatus = [{ value: "IN_PROGRESS", label: "In Progress", description: "The negotiation is currently in progress." }, { value: "ABANDONED", label: "Abandoned", description: "The negotiation has been abandoned." }]
    } else {
      this.filtersStatus = await this.retrieveNegotiationLifecycleStates()
    }

    if (Object.keys(this.$route?.query).length) {
      this.loadActivefiltersSortDataFromURL()
    } else {
      if (this.userRole === "ROLE_REPRESENTATIVE") {
        this.filtersSortData.status = ["IN_PROGRESS", "ABANDONED"]
      }
      this.retrieveNegotiationsByUserRole(0)
    }
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByUserId", "retrieveNegotiations", "retrieveNegotiationLifecycleStates", "retrieveUser", "retrieveUserRoles"]),
    async retrieveNegotiationsByUserRole (pageNumber) {
      if (this.userRole === "ROLE_ADMIN") {
        this.negotiations = await this.retrieveNegotiations({ filtersSortData: this.filtersSortData, pageNumber })
      }

      if (this.userRole === "ROLE_RESEARCHER") {
        this.negotiations = await this.retrieveNegotiationsByUserId({ role: "author", filtersSortData: this.filtersSortData, userId: this.userId, pageNumber })
      }

      if (this.userRole === "ROLE_REPRESENTATIVE") {
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
      this.updateRoutingParams(currentPageNumber)
    },
    retrieveNegotiationsBySortAndFilter (filtersSortData) {
      this.filtersSortData = filtersSortData

      this.incriseDateEndIfSame()
      this.retrieveNegotiationsByUserRole(0)

      this.updateRoutingParams(1)
    },
    updateRoutingParams (currentPageNumber) {
      this.$router.push({ query: { filtersSort: encodeURI(JSON.stringify(this.filtersSortData)), currentPageNumber } })
    },
    loadActivefiltersSortDataFromURL () {
      if (this.$route?.query.filtersSort) {
        this.filtersSortData = JSON.parse(decodeURI(this.$route?.query.filtersSort))
      }

      if (this.$route?.query.currentPageNumber) {
        this.retrieveNegotiationsByUserRole(this.$route?.query.currentPageNumber - 1)
      } else {
        this.retrieveNegotiationsByUserRole(0)
      }
    },
    incriseDateEndIfSame () {
      if (this.filtersSortData.dateStart && this.filtersSortData.dateStart === this.filtersSortData.dateEnd) {
        this.filtersSortData.dateEnd = moment(this.filtersSortData.dateEnd).add(1, "days").format("YYYY-MM-DD")
      }
    }
  }
}
</script>
