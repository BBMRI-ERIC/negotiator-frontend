<template>
  <!-- Example single danger button -->
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
          href="https://github.com/BBMRI-ERIC/negotiator-v3-frontend"
          class="dropdown-item text-primary-text"
        >  <i class="bi bi-github" />
          GitHub UI
        </a>
      </li>
      <li>
        <a
          href="https://github.com/BBMRI-ERIC/negotiator"
          class="dropdown-item text-primary-text"
        >  <i class="bi bi-github" />
          GitHub Application
        </a>
      </li>
      <li>
        <a
          href="/api/swagger-ui/index.html"
          class="dropdown-item text-primary-text"
        > <i class="bi bi-braces-asterisk" />
          API
        </a>
      </li>
      <li>
        <a
          href="https://www.bbmri-eric.eu/wp-content/uploads/AoM_10_8_Access-Policy_FINAL_EU.pdfl"
          class="dropdown-item text-primary-text"
        > <i class="bi bi-shield-lock" />
          Privacy Policy
        </a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li>
        <a
          href="https://profile.aai.lifescience-ri.eu/profile"
          class="dropdown-item text-primary-text"
        >  <i class="bi bi-gear" />
          Settings
        </a>
      </li>
      <li><hr class="dropdown-divider"></li>
      <li class="text-center">
        <button
          class="btn btn-outline-navbar-button-outline me-2 "
          aria-current="page"
          @click.stop.prevent="signOutOidc"
        >
          <i class="bi bi-box-arrow-right" /> Logout
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from "vuex"

export default {
  name: "ProfileSettings",
  props: {
    user: {
      type: Object,
      default: {}
    },
    isRepresentative: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    returnAcronymOfName () {
      const str = this.user?.name
      const matches = str.match(/\b(\w)/g)
      const acronym = matches.join(" ")
      return acronym
    }
  },
  methods: {
    ...mapActions([
      "signOutOidc"
    ])
  }

}
</script>

  <style>
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
