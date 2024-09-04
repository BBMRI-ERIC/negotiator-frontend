<template>
  <div v-if="!loading">
    <div class="container">
      <div class="organization-details">
        <div class="avatar">
          <i class="bi bi-person-circle mt-2" /> <!-- You can replace this with an actual image if you have one -->
        </div>
        <div class="organization-info ms-3">
          <h1 class="h2 lh-condensed">
            {{ network.name.toUpperCase() }}
          </h1>
          <div class="description">
            Network Description Here
          </div> <!-- Replace with actual description if available -->
          <ul class="list-style-none">
            <li>
              <i class="bi bi-globe" />
              <a
                href="{{ network.uri }}"
                class="ms-2"
              >{{ network.uri }}</a>
            </li>
            <li>
              <i class="bi bi-envelope" />
              <a
                href="mailto:{{ network.contactEmail }}"
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
      <h4 class="mb-4">
        <i class="bi bi-graph-up" />
        Insights:
      </h4>
      <div class="card">
        <div class="card-body">
          <h4 class="card-title">
            Statistics Overview
          </h4>

          <!-- Progress Bar -->
          <div class="progress mb-4">
            <div
              v-for="(stat, key) in stats"
              :key="key"
              :class="['progress-bar', stat.color]"
              :style="{ width: (stat.value / total * 100) + '%' }"
            >
              {{ stat.value }}
            </div>
          </div>
          <div class="row text-center">
            <div
              v-for="(stat, key) in stats"
              :key="key"
              class="col-md-4"
            >
              <div class="stat-box">
                <h5>{{ (stat.value / total * 100).toFixed(0) }}</h5>
                <p class="text-muted">
                  {{ stat.label }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center my-4">
        <hr class="flex-grow-1">
        <span class="mx-3 text-muted"> <i class="bi bi-circle" /> Latest Negotiations</span>
        <hr class="flex-grow-1">
      </div>
      <ul class="list-unstyled">
        <li
          v-for="negotiation in negotiations"
          :key="negotiation.id"
        >
          <div class="d-flex align-items-center">
            <span
              class="badge"
              :class="getBadgeColor(negotiation.status)"
              style="width: 120px;"
            >
              <i
                :class="getBadgeIcon(negotiation.status)"
                class="px-1"
              />
              {{ transformStatus(negotiation.status) }}
            </span>
            <h5 class="mb-0 ms-1">
              {{ negotiation ? negotiation.payload.project.title?.toUpperCase() : "" }}
            </h5>
          </div>
          <p class="text-muted small">
            #{{ negotiation.id }} &bullet; Created on: {{ new Date(negotiation.creationDate).toLocaleDateString() }}
          </p>
        </li>
      </ul>
    </div>
  </div>
  <LoadingSpinner v-else: />
</template>

<script setup>
import { computed, onMounted, ref } from "vue"
import { useNetworksPageStore } from "@/store/networksPage"
import LoadingSpinner from "@/components/LoadingSpinner.vue"
import { useRoute } from "vue-router"
import { useUserStore } from "@/store/user"
import { getBadgeColor, getBadgeIcon, transformStatus } from "@/composables/utils"

const props = defineProps({
  networkId: {
    type: String,
    required: true
  }
})
const route = useRoute()
const userStore = useUserStore()
const networksPageStore = useNetworksPageStore()
const network = ref(undefined)
const negotiations = ref(undefined)
const loading = computed(() => {
  return network.value === undefined && negotiations.value === undefined
})
const stats = ref({
  in_progress: { value: 50, label: "In Progress", color: "bg-success" },
  concluded: { value: 30, label: "Concluded", color: "bg-info" },
  abandoned: { value: 20, label: "Abandoned", color: "bg-danger" }
})
const total = computed(() => {
  return Object.values(stats.value).reduce((sum, stat) => sum + stat.value, 0)
})
onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser()
  }
  loadNetworkInfo(props.networkId)
  retrieveLatestNegotiations(props.networkId)
})

async function loadNetworkInfo (networkId) {
  network.value = await networksPageStore.retrieveNetwork(networkId)
}
async function retrieveLatestNegotiations (networkId) {
  const response = await networksPageStore.retrieveNetworkNegotiations(networkId)
  negotiations.value = response._embedded.negotiations
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
  border-bottom: 1px solid #d1d5da;
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
</style>
