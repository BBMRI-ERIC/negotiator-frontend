<template>
    <navigation-bar />
    <div class="container">
        <NegotiationList :negotiations="negotiations"/>
    </div>
</template>

<script>
import NegotiationList from "@/components/NegotiationList.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import {mapActions, mapGetters} from "vuex";

export default {
    name: "Biobanker",
    components: {
        NavigationBar,
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
        const token = await this.$auth.getAccessToken();
        await this.retrieveBiobankerRoleNegotiations({
            token
        });
    },
}
</script>

<style scoped>

.container{
    max-width: 1000px;
    margin: 30px auto;
    overflow: auto;
    min-height: 200px;
    text-align: center;
    padding: 30px;
}
</style>