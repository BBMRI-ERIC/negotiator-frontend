<template>
  <div class="btn-group">
    <b-avatar
      type="button"
      variant="primary"
      :text="returnAcronymOfName"
      class="mr-3"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    />

    <ul class="dropdown-menu dropdown-menu-end mt-1">
      <li class="container mb-3 mt-2">
        <div class="d-flex flex-row">
          <b-avatar
            type="button"
            variant="primary"
            :text="returnAcronymOfName"
            class="me-3 mt-1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          />
          <div>
            <div>{{ user.email }}</div>
            <div class="text-muted">
              {{ user.name }}
            </div>
          </div>
          <i class="bi bi-x ms-2 h4" />
        </div>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <a
          href="https://profile.aai.lifescience-ri.eu/profile"
          class="dropdown-item text-primary-text"
        >  <i class="bi bi-gear" />
          Profile Settings
        </a>
      </li>
      <li v-if="isRepresentative">
        <a
          :href="externalLinks.auth_management_link"
          class="dropdown-item text-primary-text"
        >  <i class="bi bi-person-gear" />
          Authorization Settings
        </a>
      </li>
      <li v-if="isAdmin">
        <router-link to="/settings" class="dropdown-item text-primary-text">
          <i class="bi bi-sliders" />
          Admin Settings
        </router-link>
      </li>
      <li>
        <hr class="dropdown-divider">
      </li>
      <li>
        <a href="https://www.bbmri-eric.eu/wp-content/uploads/AoM_10_8_Access-Policy_FINAL_EU.pdfl"
          class="dropdown-item text-primary-text"> <i class="bi bi-shield-lock" />
          Privacy Policy
        </a>
      </li>
      <li>
        <a href="https://www.bbmri-eric.eu/services/access-policies/" class="dropdown-item text-primary-text"> <i 
          class="bi bi-clipboard-check" />
          Access Policy
        </a>
      </li>
      <li>
        <hr class="dropdown-divider">
      </li>
      <li class="text-center sign-out">
        <button
          class="btn me-2 "
          aria-current="page"
          @click.stop.prevent="signOutOidc"
        >
          <i class="bi bi-box-arrow-right" /> Sign Out
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue"
import externalLinks from "@/config/externalLinks"
import { useOidcStore } from "@/store/oidc";

const oidcStore = useOidcStore()

const props = defineProps({
  user: {
    type: Object,
    default: {}
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isRepresentative: {
    type: Boolean,
    default: false
  }
})

const returnAcronymOfName = computed(() => {
  const words = props.user?.name.split(" ")

  // Initialize an empty string for the acronym
  let acronym = ""

  // Iterate over each word
  words.forEach(word => {
  // Get the first character of each word and append it to the acronym
    if (word.length > 0) {
      acronym += word[0].toUpperCase() + " "
    }
  })
  return acronym
})

function signOutOidc () {
  oidcStore.signOutOidc()
}
</script>

  <style>
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.sign-out:hover {
  color: #dc3545;
}
</style>