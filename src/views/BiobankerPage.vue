<template>
    <NegotiationList :negotiations="negotiations"/>
</template>

<script>
import NegotiationList from "@/components/NegotiationList.vue";
import {mapActions, mapGetters} from "vuex";

export default {
    components: {
        NegotiationList
    },
    methods: {
        ...mapActions(["retrieveBiobankerRoleNegotiations"])
    },
    computed: {
        ...mapGetters({
            negotiations: "getNegotiations",
        })
    },
    async mounted() {
        await this.retrieveBiobankerRoleNegotiations();
    },
}
</script>
