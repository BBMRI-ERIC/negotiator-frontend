<template>
  <nav
    v-if="negotiations?.length > 0 && pagination.totalPages > 1"
    aria-label="Page navigation"
  >
    <ul class="pagination pagination-sm justify-content-center mt-2">
      <li
        class="page-item"
        :class="currentPageNumber === 1 ? 'disabled' : ''"
      >
        <a
          class="page-link text-primary-text"
          href="#"
          tabindex="-1"
          aria-disabled="true"
          @click="changeCurrentPage(currentPageNumber - 1)"
        >Previous</a>
      </li>
      <li
        v-for="page in pagination.totalPages"
        :key="page"
        class="page-item"
        :class="page === currentPageNumber ? 'disabled' : ''"
      >
        <a
          class="page-link text-primary-text"
          href="#"
          @click="changeCurrentPage(page)"
        >
          {{ page }}
        </a>
      </li>
      <li
        class="page-item"
        :class="currentPageNumber < pagination.totalPages ? '' : 'disabled'"
      >
        <a
          class="page-link text-primary-text"
          href="#"
          @click="changeCurrentPage(currentPageNumber + 1)"
        >Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "NegotiationPagination",
  props: {
    negotiations: {
      type: Array,
      default: undefined
    },
    pagination: {
      type: Object,
      default: undefined
    }
  },
  emits: ["currentPageNumber"],
  data () {
    return {
      currentPageNumber: 1
    }
  },
  mounted () {
    if (this.$route?.query.currentPageNumber) {
      this.currentPageNumber = parseInt(this.$route?.query.currentPageNumber)
    }
  },
  methods: {
    changeCurrentPage (pageNumber) {
      this.$emit("currentPageNumber", pageNumber)
      this.currentPageNumber = pageNumber
    }
  }
}
</script>
