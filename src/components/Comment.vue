<template>
  <div class="comment">
    <auth-guard>
      <div slot="no-auth">
        <div class="comment__login">
          <p><label for=""></label><input type="text"></p>
          <p><label for=""><input type="password"></label></p>
          <p><button>Login</button></p>
        </div>
      </div>
      <div slot="auth">

      </div>
    </auth-guard>
  </div>
</template>


<script>
  export default {
    data() {
      return {};
    },
  };
</script>


<style lang="scss" scoped>
  
</style>