<template>
  <div class="container pt-4">
    <div class="row text-center">
      <div class="col-3" />
      <div class="col-6">
        <div class="jumbotron">
          <h1 class="display-4">
            Please login before continuing
          </h1>
          <p class="lead">
            You cannot access this page before logging in
          </p>
        </div>
      </div>
      <div class="col-3" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex"


export default {
  methods: {
    ...mapActions([
      "authenticateOidc"
    ])
  }
}
</script>

