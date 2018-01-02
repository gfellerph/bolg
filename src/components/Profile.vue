<template>
  <div class="profile">
    <auth-guard>
      <div slot="auth">
        <h3>{{user.email}}</h3>
        <p class="text-align-center">
          <button @click="logout" class="small">Logout</button>
        </p>
      </div>
      <div slot="no-auth">
        <router-link to="/login">Login</router-link>
      </div>
    </auth-guard>
  </div>
</template>

<script>
  import AuthGuard from 'src/components/AuthGuard';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {};
    },

    computed: mapState({
      user: state => state.auth.user,
    }),

    methods: {
      logout() { this.user.logout(); },
    },

    components: {
      AuthGuard,
    },
  };
</script>


<style lang="scss" scoped>

</style>
