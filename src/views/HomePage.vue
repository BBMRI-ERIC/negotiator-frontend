<template>
  <body>
    <h1 v-if="!isUserLoggedIn">Welcome! ckick in the login button below to start login process</h1>
    <button
      v-if="!isUserLoggedIn"
      @click="onLogin()"
    >
      Login
    </button>
    <button
      v-else
      @click="onLogout()"
    >
      Logout
    </button>

    <h1 v-if="isUserLoggedIn"> Dear {{ user }}, You are logged in! This is your Authentication Token: </h1>
    
    <div class="box">
      <p align="justify">{{ authToken }}</p>
    </div>


  </body>
</template>

<script>

export default {
  name: "navigation-bar",
  data () {
    return {
      isUserLoggedIn: false,
      authToken : '',
      user: ''
    }
  },
  async mounted () {
    console.log(this.$auth)
    this.isUserLoggedIn = await this.$auth.isUserLoggedIn()
    if(this.isUserLoggedIn) {
      this.authToken = await this.$auth.getAccessToken()
      const profile = await this.$auth.getProfile()
      this.user = profile.name
    }
    //this.$auth.isUserLoggedIn()
    //  .then(isLoggedIn => {
    //    console.log('Evaluating Mounted...')
    //    console.log(isLoggedIn)
    //    this.isUserLoggedIn = isLoggedIn
    //  })
      // If somehting goes wrong we assume no user is logged in
    //  .catch(error => {
    //    console.log(error)
    //    this.isUserLoggedIn = false
    // })

    // registerUserLoggedInEventListener(() => { this.isUserLoggedIn = true })
    // registerUserLoggedOutEventListener(() => { this.isUserLoggedIn = false })
  },
  methods: {
    onLogin () {
      console.log('CALLED')
      this.$auth.login()
    },
    onLogout () {
      this.$auth.logout()
    }
  }
};

</script>

<style scoped>
.box {
  inline-size: 300px; 
}
</style>