<template>
  <div class="profile">
    <div v-if="user">
      <h3 class="h6">{{user.email}}</h3>
      <p class="text-align-center">
        <button @click="logout" class="small">Logout</button>
      </p>
    </div>
    <div v-if="!user">
      <router-link to="/login">Login</router-link>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: mapState({
      user: state => state.auth.user,
    }),

    methods: {
      logout() {
        this.$store.commit('LOGOUT');
        this.$router.push('/login');
      },
    },
  };
</script>
