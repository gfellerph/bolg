<template>
  <div class="map-search">
    <div class="map-search__box map__box">
      <label for="map-search-input" class="sr-only">Sueche</label>
      <input
        id="map-search-input"
        type="text"
        class="map-search__input"
        placeholder="Reiseort sueche"
        ref="searchInput"
        v-model="searchTerm"
      >
      <img v-if="status == state.INITIAL" class="map-search__icon" src="/img/search.svg" alt="">
      <button
        class="plain map-search__reset"
        v-if="status != state.INITIAL"
        @click="reset"
      >
        <img class="map-search__icon" src="/img/close.svg" alt="">
        <span class="sr-only">Lösche</span>
      </button>
    </div>
    <button
      v-if="status == state.LOCATION_SELECTED"
      class="map-search__cta"
      @click="addTipp"
    >Reisetipp zu däm Ort gä?</button>
    <tipp-info
      v-if="status == state.INITIAL && showTippInfo"
      v-on:close-tipp-info="closeTippInfo"
    ></tipp-info>
    <add-tipp
      v-if="status == state.ADD_TIPP"
      :location="location"
      :map="map"
      v-on:close-add-tipp="reset"
      v-on:tipp-add-success="addTippSuccess"
    ></add-tipp>
    <add-tipp-success
      v-if="status == state.ADD_TIPP_SUCCESS"
      v-on:close-add-tipp-success="reset"
    ></add-tipp-success>
  </div>
</template>

<script>
  import bus from 'src/config/bus';
  import AddTipp from 'src/components/AddTipp';
  import AddTippSuccess from 'src/components/AddTippSuccess';
  import TippInfo from 'src/components/TippInfo';

  /* global google */

  const state = {
    INITIAL: 0,
    SEARCHING: 1,
    LOCATION_SELECTED: 2,
    ADD_TIPP: 3,
    ADD_TIPP_SUCCESS: 4,
  }

  export default {
    components: {
      AddTipp,
      AddTippSuccess,
      TippInfo,
    },

    data() {
      return {
        state,
        status: state.INITIAL,
        searchTerm: '',
        searchBox: null,
        showTippInfo: false,
        location: null,
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
      addTipp() { this.status = state.ADD_TIPP; },
      addTippSuccess() { this.status = state.ADD_TIPP_SUCCESS; },
      closeTippInfo() {
        if (window.sessionStorage) {
          window.sessionStorage.setItem('tippInfo', JSON.stringify(true));
        }
        this.showTippInfo = false;
      },
    },
  }
</script>

<style lang="scss">
  @import 'src/styles/core/_index';

  .pac-container {
    margin-top: 5px;

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

    @include min($s) {
      width: 33%;
    }

    @include between($xxs, $s) {
      width: 50%;
    }

    @include max($xxs) {
      top: 0;
      left: $golden-rem;
      right: $golden-rem;
    }
  }

  .map-search__cta {
    display: block;
    background: cornflowerblue;
    color: white;
    width: 100%;
    border: none;
    border-radius: 3px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.25);
    padding: $golden-rem/2;

    &:focus {
      outline-color: white;
    }
  }

  .map-search__box {
    display: flex;
    align-items: center;
    margin-bottom: $golden-rem/2;

    @include max($xxs) {
      margin-right: $golden-rem * -1;
      margin-left: $golden-rem * -1;
      border-top: 1px solid lightgrey;
      border-radius: 0;
      box-shadow: none;
    }

    .map-search__input {
      font-family: 'Roboto', sans-serif;
      border-bottom: none;
    }

    .map-search__reset {
      font-size: 1em;
      padding: $golden-em / 2;

      .map-search__icon {
        margin: 0;
      }
    }
  }


  .map-search__icon {
    display: block;
    max-width: none;
    width: $golden-em;
    height: $golden-em;
    margin: 0 $golden-em / 2;
    padding: ($golden-em - 1em) / 2;
  }

</style>
