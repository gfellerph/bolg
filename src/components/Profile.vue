<template>
  <div class="profile">
    <auth-guard>
      <div slot="auth">
        <p>name</p>
      </div>
      <div slot="no-auth">
        <router-link to="/login">Login</router-link>
      </div>
    </auth-guard>
  </div>
</template>


<script>
  import AuthGuard from '@/components/AuthGuard';

  export default {
    data() {
      return {};
    },

    components: {
      AuthGuard,
    }
  };
</script>


<style lang="scss" scoped>
  
</style>