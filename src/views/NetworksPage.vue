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
const loading = computed(() => {
  return network.value === undefined
})
onMounted(async () => {
  if (Object.keys(userStore.userInfo).length === 0) {
    await userStore.retrieveUser()
  }
  loadNetworkInfo(props.networkId)
})

async function loadNetworkInfo (networkId) {
  network.value = await networksPageStore.retrieveNetwork(networkId)
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
</style>
