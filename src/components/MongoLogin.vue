<template>
  <div class="login">
    <router-link v-if="$store.state.auth.mongoUser" to="/">Home</router-link>
    <div v-if="!$store.state.auth.mongoUser" @keyup.enter="login">
      <p>
        <label for="email">Email</label>
        <input id="email" v-model="email" type="text">
      </p>
      <p>
        <label for="password">Password</label>
        <input id="password" v-model="password" type="password">
      </p>
      <p class="error" v-if="error">{{error}}</p>
      <p><button :disabled="loading" @click="login">Login</button></p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import router from 'src/config/router';

  export default {
    data() {
      return {
        email: '',
        password: '',
        error: false,
        loading: false,
      };
    },

    methods: {
      login() {
        this.loading = true;
        axios.post('/api/user/authenticate', {
          email: this.email,
          password: this.password,
        })
          .then((res) => {
            this.loading = false;
            this.error = false;
            this.$store.commit('MONGOLOGIN', {
              token: res.data.token,
            });
            if (this.$route.query.redirect) {
              router.push({ path: this.$route.query.redirect });
            } else {
              router.push({ path: '/' })
            }
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.message;
            this.$store.commit('MONGOLOGOUT');
          });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .login {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
</style>
