<template>
  <FilterSort
    v-if="!loading"
    :filters-sort-data="filtersSortData"
    :user-role="userRole"
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
    this.userId = this.user?.id

    if (Object.keys(this.$route?.query).length) {
      this.loadActivefiltersSortDataFromURL()
    } else {
      this.retrieveNegotiationsByUserRole(0)
    }
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByUserId", "retrieveNegotiations", "retrieveUser", "retrieveUserRoles"]),
    async retrieveNegotiationsByUserRole (pageNumber) {
      if (this.userRole === "ROLE_ADMIN") {
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
      this.updateRoutingParams(currentPageNumber)
    },
    retrieveNegotiationsBySortAndFilter (filtersSortData) {
      this.filtersSortData = filtersSortData

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
    }
  }
}
</script>
