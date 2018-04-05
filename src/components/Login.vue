<template>
  <div class="login" @keyup.enter="login">
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
</template>

<script>
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

    // Test if token is still valid
    mounted() {
      // Prevent user from submitting temporarily
      this.loading = true;
      this.$store.dispatch('REFRESH')
        .then(() => {
          this.loading = false;
          this.reroute();
        })
        .catch(() => {
          this.loading = false;
        });
    },

    methods: {
      reroute() {
        if (this.$route.query.redirect) {
          router.push({ path: this.$route.query.redirect });
        } else {
          router.push({ path: '/' })
        }
      },
      login() {
        this.loading = true;
        this.$store.dispatch('LOGIN', {
          email: this.email,
          password: this.password,
        })
          .then(() => {
            this.loading = false;
            this.error = false;
            this.reroute();
          })
          .catch((err) => {
            this.loading = false;
            this.error = err.message;
          });
      },
    },
  };
</script>

<style lang="scss" scoped>
  p {
    margin: 0.402rem auto;
  }

  .login {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
</style>
