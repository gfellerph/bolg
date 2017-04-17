<template>
  <div class="google-login">
    <button @click="loginWithGoogle">google login</button>
    <button @click="loginWithFacebook">facebook login</button>
  </div>
</template>

<script>
  import { auth, GoogleProvider, FacebookProvider } from '@/config/firebase';

  export default {
    data() {
      return {
        
      };
    },

    methods: {
      loginWithGoogle() {
        auth.signInWithPopup(GoogleProvider);
      },
      loginWithFacebook() {
        auth.signInWithPopup(FacebookProvider);
      },
    },
  };
</script>

<style lang="scss">
  
</style>
