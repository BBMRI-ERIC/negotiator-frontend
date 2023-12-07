<template>
  <NegotiationList 
    :negotiations="negotiations" 
    :user-role="userRole"
  />
</template>
<script>

import NegotiationList from "@/components/NegotiationList.vue"
import { mapActions } from "vuex"
import { ROLES } from "@/config/consts.js"

export default {
  components: {
    NegotiationList
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
  data() {
    return {
      negotiations: undefined,
      roles: []
    }
  },
  async mounted() {
    this.negotiations = await this.retrieveNegotiationsByRole({ userRole: this.userRole })
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByRole", "retrieveUserRoles"])
  }
}
</script>