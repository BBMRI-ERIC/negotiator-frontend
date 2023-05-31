<template>
  <NegotiationList 
    :negotiations="negotiations" 
    :role="role"
  />
</template>
<script>

import NegotiationList from "@/components/NegotiationList.vue"
import { mapActions } from "vuex"

export default {
  components: {
    NegotiationList
  },
    
  props: {
    role: {
      type: String,
      required: true,
      validator: function (value) {
        return ["RESEARCHER", "BIOBANKER"].includes(value)
      }
    }
  },
  data() {
    return {
      negotiations: []
    }
  },
  async mounted() {
    this.negotiations = await this.retrieveNegotiationsByRole({ role: this.role })
  },
  methods: {
    ...mapActions(["retrieveNegotiationsByRole"])
  }
}
</script>