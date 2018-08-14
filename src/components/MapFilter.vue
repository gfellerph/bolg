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

<style lang="scss">
  @import 'src/styles/core/variables';

  .map__filter {
    border-top: 1px solid lightgrey;
    padding: 0 $golden-rem / 2;
  }

  .map__filter,
  .map__filter-panel {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
  }

  .map__filter-panel label {
    display: flex;
    align-items: center;
    padding: $golden-rem / 8 $golden-rem / 4;
    border-radius: 50px;
    border: 3px solid lightgrey;
    transition: border 0.3s, background 0.3s;

    &.active,
    &.checked {
      border-color: dodgerblue;
    }

    &.checked {
      background: dodgerblue;
      color: white;
    }

    & + label {
      margin-left: $golden-rem / 2;
    }

    img {
      height: 24px;
      width: 24px;
      margin-right: $golden-rem / 4;
    }

    input[type="radio"],
    input[type="checkbox"] {
      opacity: 0;
      position: absolute;
      pointer-events: none;
    }
  }
</style>
