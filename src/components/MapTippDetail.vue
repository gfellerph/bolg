<template>
  <div class="map-tipp-detail map__box">
    <button
      class="map-tipp-detail__close blank"
      @click="closeMapTippDetail"
    >
      <img src="/img/chrüz.png">
      <span class="sr-only">Schliesse</span>
    </button>
    <p>{{tipp.text}}</p>
    <p class="italic small text-align-right">- {{tipp.name}}</p>
  </div>
</template>

<script>
export default {
  props: {
    tipp: Object,
  },
  methods: {
    closeMapTippDetail() {
      this.$emit('close');
    },
  },
}
</script>

<style lang="scss">
  @import 'src/styles/core/_index';

  .map-tipp-detail {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: $golden-rem;
    max-height: 50vh;
    overflow: auto;

    @include max($xs) {
      margin: 0 $golden-rem / 4 $golden-rem / 4;
      right: 0;
    }

    @include min($xs) {
      top: 0;
      width: 33vw;
      margin: $golden-rem;
    }

    p:first-of-type {
      margin-top: 0;
    }

    p:last-of-type {
      margin-bottom: 0;
    }
  }

  .map-tipp-detail__close {
    float: right;
    width: $golden-rem * 1.5;
    margin: -1rem -1rem 0 0;
  }
</style>
