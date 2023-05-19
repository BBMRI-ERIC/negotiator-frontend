<template>
    <div>
                <h3>Negotation details page</h3>
                <table class="table table-bordered">
      <tbody>
        <tr>
          <th scope="row">ID</th>
          <td>{{ this.negotiation.id }}</td>
          <th scope="row">Created By</th>
          <td>{{ this.negotiation.persons[0].name }}</td>
        </tr>
        <tr>
          <th scope="row">Status</th>
          <td>{{ this.negotiation.status }}</td>
          <th scope="row">Last Update</th>
          <td></td>
        </tr>
      </tbody>
    </table>
    </div> 
    <div>
            <h3>Negotiation messages list</h3>

            <ul  class="list-group list-group-vertical">
                <li class="list-group-item" v-for="post in posts" :key="post.text" > {{ post.text }}</li>
            </ul>
    </div>  
    <div id="add-new-message">
    <br/>
            <h3>Add a new message for the negotiation</h3>
            <form @submit="message">
                <textarea class="form-control" style="min-width: 100%" v-model = "message.text"></textarea>
                <br/>
                <div class="wizard-footer-right">
                <button @click="addMessage" type="submit" class="btn btn-secondary">Add message</button>
                </div>
            </form>

    </div>

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
            posts: undefined, 
            message: {
                text: "", 
                resourceId: undefined
            }
        };
    },
  methods: {
    ...mapActions(["retrieveNegotiationById", "retrievePostsByNegotiationId", "addMessageToNegotiation"]), 
    async addMessage() {
        await this.addMessageToNegotiation({        
            data: {
                resourceId: '1', //this.negotiation.requests[0].id,
                text: this.message.text,
                negotiationId: this.negotiation.id                
            }
        }).then((messageId) => {
            if (messageId) {
                this.showNotification("light", 
                    "Message added correctly")
            } 
        });
    },
  },
    async created() {
        this.negotiation = await this.retrieveNegotiationById({ negotiationId: this.negotiationId })
        this.posts = await this.retrievePostsByNegotiationId({ negotiationId: this.negotiationId })
        console.log(this.negotiation)
        console.log(this.posts)
    }
}

</script>