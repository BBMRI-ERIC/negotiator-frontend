<template>
    <p>This is the negotiation {{ this.negotiationId }} details page</p>
</template>

<script>
import { mapActions } from "vuex";

export default {
    name: "negotiation-page",
    props: {
        negotiationId: String,

    },
    data() {
        return {
            negotiation: undefined, 
            posts: undefined
        };
    },
  methods: {
    ...mapActions(["retrieveNegotiationById", "retrievePostsByNegotiationId"])
  },
    async mounted() {
        this.negotiation = await this.retrieveNegotiationById({ negotiationId: this.negotiationId })
        this.posts = await this.retrievePostsByNegotiationId({ negotiationId: this.negotiationId })
        console.log(this.negotiation)
        console.log(this.posts)
    }
}

</script>