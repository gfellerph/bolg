<template>
  <div class="map-search">
    <div class="map-search__box map__box">
      <input
        type="text"
        class="map-search__input"
        placeholder="Sueche"
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
      </button>
    </div>
    <button
      v-if="status == state.LOCATION_SELECTED"
      class="map-search__cta"
      @click="addTipp"
    >Reisetipp zu däm Ort gä?</button>
    <tipp-info
      v-if="status == state.INITIAL && showTippInfo"
      v-on:close-tipp-info="toggleTippInfo"
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
  import bus from '@/config/bus';
  import AddTipp from '@/components/AddTipp';
  import AddTippSuccess from '@/components/AddTippSuccess';
  import TippInfo from '@/components/TippInfo';

  const state = {
    INITIAL: 0,
    SEARCHING: 1,
    LOCATION_SELECTED: 2,
    ADD_TIPP: 3,
    ADD_TIPP_SUCCESS: 4
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
        showTippInfo: true,
        location: null,
        marker: new google.maps.Marker({
					title: 'Reisetipp hie hinzuefüege?',
					icon: {
						url: '/img/inuksuk-selected.svg',
						size: new google.maps.Size(36, 34),
						origin: new google.maps.Point(0,0),
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
    },

    methods: {
      init(map) {
        this.searchBox = new google.maps.places.SearchBox(this.$refs.searchInput);
        this.searchBox.addListener('places_changed', this.placeChanged);
      },
      placeChanged() {
        const place = this.searchBox.getPlaces()[0];

        if (!place.geometry) {
          return;
        }

        this.location = place.geometry.location;
        this.status = state.LOCATION_SELECTED;

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);  // Why 17? Because it looks good.
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
      toggleTippInfo() { this.showTippInfo = !this.showTippInfo; },
      addTipp() { this.status = state.ADD_TIPP; },
      addTippSuccess() { this.status = state.ADD_TIPP_SUCCESS; },
    },
  }
</script>

<style lang="scss">
  @import 'src/styles/_mixins';
  @import 'src/styles/_variables';

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

    @include min($s) {
      width: 33%;
    }

    @include between($xxs, $s) {
      width: 50%;
    }

    @include max($xxs) {
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