<template>
  <div class="map-search map__box">
    <!-- <div class="map-search__box">
      <label for="map-search-input" class="sr-only">Sueche</label>
      <input
        id="map-search-input"
        type="text"
        class="map-search__input"
        placeholder="Reiseort sueche"
        ref="searchInput"
        v-model="searchTerm"
      >
      <img v-if="status == state.INITIAL" class="map-search__icon" src="/img/sueche.png" alt="">
      <button
        class="plain map-search__reset"
        v-if="status != state.INITIAL"
        @click="reset"
      >
        <img class="map-search__icon" src="/img/chrüz.png" alt="">
        <span class="sr-only">Lösche</span>
      </button>
    </div>-->
    <map-filter v-if="status == state.INITIAL"></map-filter>
    <map-info v-if="status == state.INITIAL && mapInfo"></map-info>
    <button
      v-if="status == state.LOCATION_SELECTED"
      class="map-search__cta"
      @click="addTipp"
    >Reisetipp zu däm Ort gä?</button>
    <add-tipp
      v-if="status == state.ADD_TIPP"
      :location="location"
      :map="map"
      v-on:close-add-tipp="reset"
      v-on:tipp-add-success="addTippSuccess"
    ></add-tipp>
    <add-tipp-success v-if="status == state.ADD_TIPP_SUCCESS" v-on:close-add-tipp-success="reset"></add-tipp-success>
  </div>
</template>

<script>
import bus from 'src/config/bus';
import AddTipp from 'src/components/AddTipp';
import AddTippSuccess from 'src/components/AddTippSuccess';
import MapFilter from 'src/components/MapFilter';
import MapInfo from 'src/components/MapInfo';
import { mapState } from 'vuex';

/* global google */

const state = {
  INITIAL: 0,
  SEARCHING: 1,
  LOCATION_SELECTED: 2,
  ADD_TIPP: 3,
  ADD_TIPP_SUCCESS: 4,
};

export default {
  components: {
    AddTipp,
    AddTippSuccess,
    MapFilter,
    MapInfo,
  },

  data() {
    return {
      state,
      status: state.INITIAL,
      searchTerm: '',
      searchBox: null,
      showTippInfo: false,
      location: null,
      filter: 'tipps',
      marker: new google.maps.Marker({
        title: 'Reisetipp hie hinzuefüege?',
        icon: {
          url: '/img/inuksuk-selected.svg',
          size: new google.maps.Size(36, 34),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(18, 17),
        },
      }),
    };
  },

  props: {
    map: Object,
  },

  watch: {
    location(val) {
      // Reset marker
      if (!val) {
        this.marker.setMap(null);
        return;
      }

      // Marker already exists, just move it
      this.marker.setPosition(val);
      this.marker.setMap(this.map);
    },
  },

  mounted() {
    bus.$on('map-click', (latLng) => {
      this.location = latLng;
      this.status = state.LOCATION_SELECTED;
    });

    if (window.sessionStorage) {
      this.showTippInfo = !window.sessionStorage.getItem('tippInfo');
    }
  },

  computed: {
    ...mapState({
      mapInfo: xstate => xstate.mapStore.info,
    }),
  },

  methods: {
    init() {
      this.searchBox = new google.maps.places.SearchBox(this.$refs.searchInput);
      this.searchBox.addListener('places_changed', this.placeChanged);
    },
    placeChanged() {
      const place = this.searchBox.getPlaces()[0];

      if (!place.geometry) {
        return;
      }

      this.searchTerm = place.formatted_address;
      this.location = place.geometry.location;
      this.status = state.LOCATION_SELECTED;

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17); // Why 17? Because it looks good.
      }
    },
    reset() {
      this.searchTerm = '';
      this.location = null;
      this.status = state.INITIAL;
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
    },
    addTipp() {
      this.status = state.ADD_TIPP;
    },
    addTippSuccess() {
      this.status = state.ADD_TIPP_SUCCESS;
    },
    closeTippInfo() {
      if (window.sessionStorage) {
        window.sessionStorage.setItem('tippInfo', JSON.stringify(true));
      }
      this.showTippInfo = false;
    },
  },
};
</script>

<style lang="scss">
@import 'src/styles/core/_index';

.pac-container {
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-color: lightgrey;
  border-width: 0 1px 1px 1px;

  &:after {
    content: none;
  }
}

.pac-item {
  padding: $golden-rem/8 $golden-rem/4;
}

.pac-icon {
  display: none;
}

.map-search {
  position: absolute;
  top: $golden-rem;
  left: $golden-rem;
  z-index: 1;
  overflow: auto;
  max-height: calc(100% - #{$golden-rem * 2});

  @include min($s) {
    width: 33%;
  }

  @include between($xxs, $s) {
    width: 50%;
  }

  @include max($xxs) {
    top: $golden-rem / 4;
    left: $golden-rem / 4;
    right: $golden-rem / 4;
    max-height: calc(100% - #{$golden-rem / 2});
  }
}

.map-search__cta {
  display: block;
  background: dodgerblue;
  color: white;
  width: 100%;
  border: none;
  padding: $golden-rem/2;

  &:focus {
    outline-color: white;
  }
}

.map-search__box {
  display: flex;
  align-items: center;

  .map-search__input {
    font-family: 'Roboto', sans-serif;
    border-bottom: none;
  }

  .map-search__reset {
    font-size: 1em;

    .map-search__icon {
      margin: 0;
    }
  }
}

.map-search__icon {
  display: block;
  max-width: none;
  width: $golden-em * 2;
}
</style>
