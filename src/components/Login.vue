<template>
  <div class="login">
    <auth-guard>
      <router-link slot="auth" to="/">Home</router-link>
      <form slot="no-auth">
        <p>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="text">
        </p>
        <p>
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password">
        </p>
        <p><button @click="login">Login</button></p>
      </form>
    </auth-guard>
  </div>
</template>


<script>
  import User from '@/models/User';
  import router from '@/config/router';
  import AuthGuard from '@/components/AuthGuard';
  import {auth} from '@/config/firebase';

  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },

    created() {
      auth.onAuthStateChanged(user => {
        if (user) {
          if (this.$route.query.redirect) {
            router.push({path: this.$route.query.redirect});
          } else {
            router.push({path: '/'})
          }
        }
      });
    },

    methods: {
      login() {
        new User().login(this.email, this.password);
      },
    },

    components: {
      AuthGuard
    }
  };
</script>


<style lang="scss" scoped>
  
</style>