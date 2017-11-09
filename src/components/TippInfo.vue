<template>
  <div class="tipp-info map__box">
    <div class="box">
      <h2 class="h4">Hesch e Reisetipp?</h2>
      <p class="small">Weisch es feins Restaurant, es tolls Land oder eifach es schöns Plätzli? Mir si geng uf der Suechi nach guete Reisetipps, egau wo uf dere Wäut. Suech di Ort und gibnis di Tipp!</p>
    </div>
    <button
      class="tipp-info__close plain"
      @click="closeTippInfo"
    >
      <img src="/img/close.svg" alt="">
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },

  methods: {
    closeTippInfo() {
      this.$emit('close-tipp-info');
    },
  },
}
</script>

<style lang="scss">
  @import 'src/styles/_mixins';
  @import 'src/styles/_variables';
  @import 'src/styles/convenience';

  .tipp-info {
    position: relative;
    padding: $golden-rem/2;
  }

  .tipp-info__close {
    position: absolute;
    top: $golden-rem/2;
    right: $golden-rem/2;
    width: 24px;
    height: 24px;
  }
</style>
