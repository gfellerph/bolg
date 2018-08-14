<template>
  <div class="map__filter">
    <div class="map__filter-panel">
      <label
        for="tipps-radio"
        :class="{ active: filter === 'tipps' }"
      >
        <input
          id="tipps-radio"
          type="radio"
          name="map-filter"
          value="tipps"
          v-model="filter"
        >
        <img src="/img/inuksuk.svg" alt="Inuksuk">
        <span>Tipps</span>
      </label>
      <label
        for="journey-radio"
        :class="{ active: filter === 'journey' }"
      >
        <input
          id="journey-radio"
          type="radio"
          name="map-filter"
          value="journey"
          v-model="filter"
        >
        <img src="/img/journey.svg" alt="Reiseroute">
        <span>Route</span>
      </label>
    </div>
    <div class="map__filter-panel">
      <label
        for="tipp-info"
        :class="{ checked: info }"
      >
        <input
          id="tipp-info"
          type="checkbox"
          name="tipp-info"
          v-model="info"
        >
        <span v-if="!info">Hä?</span>
        <span v-else>Aha!</span>
      </label>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  computed: {
    info: {
      get() {
        return this.$store.state.mapStore.info;
      },
      set(value) {
        this.UPDATE_INFO({ info: value });
      },
    },
    filter: {
      get() {
        return this.$store.state.mapStore.filter;
      },
      set(value) {
        this.UPDATE_FILTER({ filter: value });
      },
    },
  },
  methods: {
    ...mapMutations(['UPDATE_FILTER', 'UPDATE_INFO']),
  },
}
</script>
