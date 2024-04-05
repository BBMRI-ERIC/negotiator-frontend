<template>
  <div class="container d-flex flex-row flex-wrap justify-content-between">
    <div class="d-flex flex-row gap-2 my-2 mx-auto mx-md-0">
      <div class="sort-by">
        <button
          class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle"
          :class="filtersSortData.sortBy !== '' ? 'btn-primary show': ''"
          type="button"
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          aria-expanded="false"
        >
          Sort by
        </button>
        <ul
          class="dropdown-menu"
          aria-labelledby="dropdownSortingButton"
          role="menu"
        >
          <div
            v-for="(sort, index) in sortBy"
            :key="index"
            class="form-check mx-2 my-2 text-sort-filter-dropdown-text"
          >
            <input
              :id="index"
              v-model="filtersSortData.sortBy"
              class="form-check-input"
              type="radio"
              name="sort"
              :value="sort.value"
              :checked="isChecked(sort.value)"
              @change="emitFilterSortData"
            >
            <label
              class="form-check-label text-sort-filter-dropdown-text"
            >
              {{ sort.label }}
            </label>
          </div>
        </ul>
      </div>

      <button
        class="btn btn-sm btn-outline-sort-filter-button-outline"
        type="button"
        @click="changeSortDirection(); emitFilterSortData();"
      >
        <i
          v-if="filtersSortData.sortDirection === 'DESC'"
          class="bi bi-sort-down"
        />
        <i
          v-if="filtersSortData.sortDirection === 'ASC'"
          class="bi bi-sort-up"
        />
      </button>

      <div class="filter-by-status">
        <button
          class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle"
          :class="filtersSortData.status.length > 0 ? 'btn-primary show':''"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filter by status
        </button>
        <ul
          class="dropdown-menu"
          aria-labelledby="dropdownSortingButton"
          role="menu"
        >
          <div
            v-for="(status, index) in filtersStatus"
            :key="index"
            class="form-check mx-2 my-2"
          >
            <input
              v-model="filtersSortData.status"
              class="form-check-input"
              type="checkbox"
              :value="status.value"
              @change="emitFilterSortData"
            >
            <label
              class="form-check-label text-sort-filter-dropdown-text"
            >
              {{ status.label }}
            </label>
          </div>
        </ul>
      </div>

      <div class="filter-by-date">
        <button
          class="btn btn-sm btn-outline-sort-filter-button-outline dropdown-toggle"
          :class="filtersSortData.dateStart !== '' || filtersSortData.dateEnd !== '' ? 'btn-primary show':''"

          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Filter by date
        </button>
        <ul
          class="dropdown-menu"
          aria-labelledby="dropdownMenuButton1"
        >
          <div class="mx-2 my-2 dropdown-contents text-sort-filter-dropdown-text">
            <div class="d-flex align-items-center mb-2">
              <label
                class="pe-2 w-25"
                for="startDate"
              >Start:</label>
              <input
                id="startDate"
                v-model="filtersSortData.dateStart"
                class="form-control form-control-sm text-sort-filter-dropdown-text"
                type="date"
                @input="emitFilterSortData"
              >
            </div>
            <div class="d-flex align-items-center">
              <label
                for="endDate"
                class="pe-3 w-25"
              >End:</label>
              <input
                id="endDate"
                v-model="filtersSortData.dateEnd"
                class="form-control form-control-sm text-sort-filter-dropdown-text"
                type="date"
                @input="emitFilterSortData"
              >
            </div>
          </div>
        </ul>
      </div>
    </div>

    <div class="my-2 ms-auto">
      <button
        type="button"
        class="btn btn-sm btn-outline-sort-filter-clear-button-outline"
        @click="clearAllFilters()"
      >
        <i class="bi bi-x-circle" />

        Clear all filters
      </button>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import { ROLES } from "@/config/consts"

export default {
  name: "NegotiationsList",
  props: {
    filtersSortData: {
      type: Object,
      default: undefined
    },
    userRole: {
      type: String,
      required: true,
      validator: function (value) {
        return [ROLES.RESEARCHER, ROLES.REPRESENTATIVE].includes(value)
      }
    }
  },
  emits: ["filtersSortData"],
  data () {
    return {
      filtersStatus: [
        { value: "SUBMITTED", label: "Under Review" },
        { value: "APPROVED", label: "Approved" },
        { value: "DECLINED", label: "Declined" },
        { value: "IN_PROGRESS", label: "In progress" },
        { value: "PAUSED", label: "Paused" },
        { value: "CONCLUDED", label: "Concluded" },
        { value: "ABANDONED", label: "Abandoned" }
      ],
      sortBy: [
        { value: "title", label: "Title" },
        { value: "creationDate", label: "Creation Date" },
        { value: "currentState", label: "Current State" }
      ]
    }
  },
  mounted () {
    this.setPredifinedFiltersForStatus()
  },
  methods: {
    setPredifinedFiltersForStatus () {
      if (this.userRole === "ROLE_REPRESENTATIVE") {
        this.filtersStatus = [{ value: "IN_PROGRESS", label: "In progress" }, { value: "ABANDONED", label: "Abandoned" }]
      }
    },
    emitFilterSortData () {
      this.$emit("filtersSortData", this.filtersSortData)
    },
    changeSortDirection () {
      if (this.filtersSortData.sortDirection === "DESC") {
        this.filtersSortData.sortDirection = "ASC"
      } else {
        this.filtersSortData.sortDirection = "DESC"
      }
    },
    formatDate (date) {
      return moment(date).format("YYYY/MM/DD HH:mm")
    },
    clearAllFilters () {
      this.filtersSortData.status = []
      this.filtersSortData.dateStart = ""
      this.filtersSortData.dateEnd = ""
      this.filtersSortData.sortBy = ""
      this.filtersSortData.sortDirection = "DESC"

      this.$router.push({ query: { } })
      this.$emit("filtersSortData", this.filtersSortData)
    },
    isChecked (value) {
      return this.filtersSortData.sortBy === value
    }
  }
}
</script>
