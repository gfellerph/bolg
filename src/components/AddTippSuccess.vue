<template>
  <div class="add-tipp__success map__box box">
    <p class="text-align-center">
      <img class="add-tipp__merci" src="/img/merci.png" alt="merci">
    </p>
    <p class="text-align-center">
      <button @click="closeMessage">Bitte</button>
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    closeMessage() {
      this.$emit('close-add-tipp-success');
    },
  },
}
</script>

<style lang="scss">
  @import 'src/styles/_mixins';
  @import 'src/styles/_variables';

  .add-tipp__success {
    padding: $golden-rem/2;
  }

  .add-tipp__merci {
    max-width: 33%;
  }
</style>

