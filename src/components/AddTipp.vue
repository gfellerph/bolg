<template>
  <div class="add-tipp">
    <auth-guard>
      <google-login slot="no-auth"></google-login>
      <form slot="auth">
        <img :src="tipp.user.photoURL" alt="">
        <h2>{{tipp.user.displayName}}</h2>
        <textarea
          name="add-tipp"
          id="add-tipp"
          v-model="tipp.text"
        ></textarea>
      </form>
    </auth-guard>
  </div>
</template>

<script>
  import Tipp from '@/Models/Tipp';
  import AuthGuard from '@/components/AuthGuard';
  import GoogleLogin from '@/components/GoogleLogin';

  export default {
    data() {
      return {
        tipp: new Tipp(),
      };
    },

    props: {
      tipp: Object,
    },

    components: {
      AuthGuard,
      GoogleLogin,
    },
  }
</script>

<style lang="scss">
  
</style>
