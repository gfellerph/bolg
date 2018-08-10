<template>
  <div class="map__filter">
    <label for="tipps-radio">
      <input
        id="tipps-radio"
        type="radio"
        name="map-filter"
        value="tipps"
        v-model="filter"
        @input="input"
      >
      <img src="/img/inuksuk.svg" alt="Inuksuk">
      <span>Tipps</span>
    </label>
    <label for="journey-radio">
      <input
        id="journey-radio"
        type="radio"
        name="map-filter"
        value="journey"
        v-model="filter"
        @input="input"
      >
      <span>Tipps</span>
    </label>
    <label for="info-radio">
      <input
        id="info-radio"
        type="radio"
        name="map-filter"
        value="info"
        v-model="filter"
        @input="input"
      >
      <span v-if="filter!=='info'">Hä?</span>
      <span v-else>Aha!</span>
    </label>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      filter: 'tipps',
    };
  },
  methods: {
    input(event) {
      this.UPDATE_FILTER({ filter: event.target.value });
    },
    ...mapMutations(['UPDATE_FILTER']),
  },
}
</script>
