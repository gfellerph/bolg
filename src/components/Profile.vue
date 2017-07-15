<template>
  <div class="profile">
    <auth-guard>
      <div slot="auth">
        <img v-if="user.photoUrl" :src="user.photoUrl" alt="">
        <span>{{user.displayName || user.email}}</span>
        <button @click="logout" class="small">Logout</button>
      </div>
      <div slot="no-auth">
        <router-link to="/login">Login</router-link>
      </div>
    </auth-guard>
  </div>
</template>


<script>
  import AuthGuard from '@/components/AuthGuard';
  import { mapState } from 'vuex';

  export default {
    data() {
      return {};
    },

    computed: mapState({
        user: state => state.auth.user,
    }),

    methods: {
      logout() { this.user.logout(); }
    },

    components: {
      AuthGuard,
    }
  };
</script>


<style lang="scss" scoped>
  
</style>