<template>
  <div v-if="!loading">
    <div class="container">
      <div class="organization-details">
        <div class="avatar">
          <i class="bi bi-people-fill mt-2" />
        </div>
        <div class="organization-info ms-3">
          <h1 class="h2 lh-condensed">
            {{ network.name.toUpperCase() }}
          </h1>
          <ul class="list-style-none">
            <li>
              <i class="bi bi-globe" />
              <a
                :href="network.uri"
                class="ms-2"
              >{{ network.uri }}</a>
            </li>
            <li>
              <i class="bi bi-envelope" />
              <a
                :href="'mailto:' + network.contactEmail"
                class="ms-2"
              >{{ network.contactEmail }}</a>
            </li>
            <li>
              <i class="bi bi-clipboard" />
              <div class="text-muted ms-2 text-nowrap">
                {{ network.externalId }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- Tabs Navigation -->
      <ul class="nav nav-tabs">
        <li class="nav-item tab cursor-pointer">
          <a
            class="nav-link"
            :class="{ active: currentTab === 'overview' }"
            @click="currentTab = 'overview'"
          >
            Overview
          </a>
        </li>
        <li class="nav-item tab cursor-pointer">
          <a
            class="nav-link"
            :class="{ active: currentTab === 'negotiations' }"
            @click="currentTab = 'negotiations'"
          >
            Negotiations
          </a>
        </li>
      </ul>
      <div v-if="currentTab === 'overview'">
        <h4 class="mb-4 mt-5">
          <i class="bi bi-graph-up" />
          Insights
        </h4>
        <p class="text-muted">
          The overview visible bellow is generated for the selected period
        </p>
        <div class="mb-4">
          <div class="mb-4">
            <div class="form-group d-inline-block mr-3">
              <label
                for="startDate"
                class="form-label"
              >Start Date:</label>
              <input
                id="startDate"
                v-model="startDate"
                type="date"
                class="form-control"
              >
            </div>

            <div class="form-group d-inline-block mx-4">
              <label
                for="endDate"
                class="form-label"
              >End Date:</label>
              <input
                id="endDate"
                v-model="endDate"
                type="date"
                class="form-control"
              >
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <span />
            <div class="d-flex flex-row mb-4">
              <h4 class="card-title">
                State of Negotiations
              </h4>
              <i
                class="bi bi-info-circle ml-2 mx-1 small-icon"
                title="States of different Negotiations involving Resources in this Network"
              />
            </div>

            <div class="progress mb-4">
              <div
                v-for="(count, status) in stats.statusDistribution"
                :key="status"
                :class="['progress-bar', getBadgeColor(status)]"
                :style="{ width: (count / stats.totalNumberOfNegotiations * 100) + '%' }"
              >
                {{ count }} {{ getLabelByValue(status) }}
              </div>
            </div>
            <div class="row text-center">
              <div class="col-md-4">
                <div class="stat-box mt-2">
                  <h5>{{ stats.totalNumberOfNegotiations }}</h5>
                  <p class="text-muted">
                    Total
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Number of Negotiations that involve resources in this network."
                    />
                  </p>
                </div>
              </div>
              <div
                v-for="(count, status) in stats.statusDistribution"
                :key="status"
                class="col-md-4"
              >
                <div class="stat-box mt-2">
                  <h5>
                    <i
                      :class="getBadgeIcon(status)"
                      class="small-icon px-1"
                    />{{ count }}
                  </h5>
                  <p class="text-muted">
                    {{ getLabelByValue(status) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-body">
            <span />
            <div class="d-flex flex-row mb-4">
              <h4 class="card-title">
                Users
              </h4>
              <i
                class="bi bi-info-circle ml-2 mx-1 small-icon"
                title="Stats for users involved with this Network"
              />
            </div>
            <div class="row text-center">
              <div class="col-md-4">
                <div class="stat-box">
                  <h5>{{ userStats.total }}</h5>
                  <p class="text-muted">
                    Total
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Total number of users that have requested access to Resources in this Network"
                    />
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="stat-box">
                  <h5>{{ userStats.new }}</h5>
                  <p class="text-muted">
                    New
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Number of new requesters"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card mt-4">
          <div class="card-body">
            <span />
            <div class="d-flex flex-row mb-4">
              <h4 class="card-title">
                Organizations
              </h4>
              <i
                class="bi bi-info-circle ml-2 mx-1 small-icon"
                title="Stats for Network Organizations involved in Negotiations"
              />
            </div>
            <div class="row text-center">
              <div class="col-md-4">
                <div class="stat-box">
                  <h5>{{ orgStats.total }}</h5>
                  <p class="text-muted">
                    Total
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Total number of users that have requested access to Resources in this Network"
                    />
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="stat-box">
                  <h5>{{ orgStats.responsive }}</h5>
                  <p class="text-muted">
                    Responsive
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Organizations that have updated a state or left a comment"
                    />
                  </p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="stat-box">
                  <h5>{{ orgStats.unresponsive }}</h5>
                  <p class="text-muted">
                    Unresponsive
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Organizations that haven't updated a state or left a comment"
                    />
                  </p>
                </div>
              </div>
              <div class="col-md-4 mt-2">
                <div class="stat-box">
                  <h5>{{ orgStats.responsive }}</h5>
                  <p class="text-muted">
                    Successful
                    <i
                      class="bi bi-info-circle small-icon"
                      title="Organizations that gave the requester access to Resources in this Network"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="currentTab === 'negotiations'" class="mt-3">
        <FilterSort
          v-if="!loading"
          :user-role="userRole"
          :filters-status="states"
          :filters-sort-data="filtersSortData"
          @filters-sort-data="retrieveLatestNegotiations"
        />
        <NegotiationList
          :negotiations="negotiations"
          :pagination="pagination"
          :network-activated="true"
          :filters-sort-data="filtersSortData"
          @filters-sort-data="retrieveLatestNegotiations"
        />
        <NegotiationPagination
          :negotiations="negotiations"
          :pagination="pagination"
          @current-page-number="retrieveLatestNegotiations"
        />
      </div>
    </div>
  </div>
  <LoadingSpinner v-else: />
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useNetworksPageStore } from "@/store/networksPage"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/store/user"
import { getBadgeColor, getBadgeIcon } from "@/composables/utils"
import FilterSort from "@/components/FilterSort.vue"
import NegotiationList from "@/components/NegotiationList.vue"
import NegotiationPagination from "@/components/NegotiationPagination.vue"
import { useNegotiationsStore } from "@/store/negotiations"

const props = defineProps({
  networkId: {
    type: String,
    required: true
  }
})
const router = useRouter()
const userStore = useUserStore()
const negotiationsStore = useNegotiationsStore()
const networksPageStore = useNetworksPageStore()
const network = ref(undefined)
const negotiations = ref(undefined)
const currentTab = ref("overview") // Default tab
const loading = computed(() => {
  return network.value === undefined && negotiations.value === undefined && stats.value === undefined
})
const stats = ref(undefined)
const userStats = ref({
  total: 5,
  new: 0
})
const orgStats = ref({
  total: 5,
  responsive: 3,
  unresponsive: 2
})
const pagination = ref(undefined)
const states = ref(undefined)
const filtersSortData = ref({
  status: [],
  dateStart: "",
  dateEnd: "",
  sortBy: "creationDate",
  sortDirection: "DESC"
})
const today = new Date()
const startOfYear = new Date(today.getFullYear(), 0, 1)
const startDate = ref(startOfYear.toISOString().slice(0, 10))
const endDate = ref(today.toISOString().slice(0, 10))
const userRole = ref('author')
const currentPageNumber = ref(0)

const total = computed(() => {
  return Object.values(stats.value).reduce((sum, stat) => sum + stat.value, 0)
})
onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser()
  }
  loadNegotiationStates()
  loadNetworkInfo(props.networkId)
  retrieveLatestNegotiations()
  loadStats(props.networkId)
})
async function loadNegotiationStates () {
  states.value = await negotiationsStore.retrieveNegotiationLifecycleStates()
  console.log(states.value)
}
function getLabelByValue (value) {
  const item = states.value.find(entry => entry.value === value)
  return item ? item.label : null // Returns null if the value is not found
}
async function loadNetworkInfo (networkId) {
  network.value = await networksPageStore.retrieveNetwork(networkId)
}
async function loadStats (networkId) {
  stats.value = await networksPageStore.retrieveNetworkStats(networkId)
}
async function retrieveLatestNegotiations () {
  const response = await networksPageStore.retrieveNetworkNegotiations(props.networkId, 10, currentPageNumber.value, userRole.value, filtersSortData.value)
  pagination.value = response.page
  if (response.page.totalElements === 0) {
    negotiations.value = {}
  } else {
    negotiations.value = response._embedded.negotiations
  }
}

function goToNegotiation (id) {
  if (!props.networkActivated) {
    router.push({
      name: "negotiation-page",
      params: { negotiationId: id }
    })
  }
}

</script>
<style>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e1e4e8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  color: #ffffff;
}
.organization-details {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
}
.organization-details img {
  margin-bottom: 1rem;
  margin-right: 1.5rem;
}
.organization-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.organization-info h1 {
  font-size: 1.75rem;
  font-weight: 600;
}
.organization-info .description {
  color: #586069;
}
.organization-info ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  margin-bottom: 0;
}
.organization-info ul li {
  max-width: 230px;
  display: flex;
  align-items: center;
  color: #586069;
}
.organization-info ul li a {
  color: #0366d6;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}
.organization-info ul li a:hover {
  text-decoration: underline;
}
.organization-info ul li svg {
  margin-right: 0.5rem;
}
.stat-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 20px;
  text-align: center;
}
.stat-box h5 {
  margin-bottom: 0;
}
.negotiation-item:hover {
  background-color: rgba(0, 0, 0, 0.075); /* Default Bootstrap hover color */
}
.small-icon{
  font-size: 0.75rem;
}
.tab.active {
  font-weight: bold;
  color: #0d6efd !important; /* Bootstrap primary color */
  background-color: #e9ecef; /* Light gray background */
  border-color: #dee2e6 #dee2e6 #fff; /* Highlighted border */
}
</style>
