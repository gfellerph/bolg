<template>
  <div class="google-login">
    <button @click="loginWithGoogle">google login</button>
    <button @click="loginWithFacebook">facebook login</button>
  </div>
</template>

<script>
  import { auth, GoogleProvider, FacebookProvider } from 'src/config/firebase';

  export default {
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
