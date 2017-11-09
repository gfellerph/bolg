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
      <img v-if="!hasPlace" class="map-search__icon" src="/img/search.svg" alt="">
      <button v-if="hasPlace" class="plain" @click="clearSearch">
        <img class="map-search__icon" src="/img/close.svg" alt="">
      </button>
    </div>
    <button
      v-if="hasPlace && !location"
      class="map-search__cta"
      @click="addTipp"
    >Reisetipp zu däm Ort gä?</button>
    <tipp-info
      v-if="!hasPlace && showTippInfo"
      v-on:close-tipp-info="toggleTippInfo"
    ></tipp-info>
    <add-tipp
      v-if="hasPlace && location"
      :location="location"
      v-on:close-add-tipp="closeAddTipp"
    ></add-tipp>
  </div>
</template>

<script>
  import bus from '@/config/bus';
  import AddTipp from '@/components/AddTipp';
  import TippInfo from '@/components/TippInfo';

  export default {
    components: {
      AddTipp,
      TippInfo,
    },

    data() {
      return {
        searchTerm: '',
        searchBox: null,
        selectedPlace: null,
        selectedLocation: null,
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
      test: String,
    },

    watch: {
      selectedLocation(val) {

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
        this.selectedLocation = latLng;
        this.selectedPlace = '';
      });
    },

    computed: {
      hasPlace() { return this.searchTerm === this.selectedPlace; }
    },

    methods: {
      init(map) {
        this.searchBox = new google.maps.places.SearchBox(this.$refs.searchInput);
        this.searchBox.addListener('places_changed', () => {
          this.selectedPlace = this.searchTerm;
          const place = this.searchBox.getPlaces()[0];

          if (!place.geometry) {
            return;
          }

          this.selectedLocation = place.geometry.location;

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
          }
        });
      },
      search() {

      },
      clearSearch() {
        this.searchTerm = '';
        this.location = null;
        this.selectedLocation = null;
        this.selectedPlace = null;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      },
      toggleTippInfo() { this.showTippInfo = !this.showTippInfo; },
      addTipp() { this.location = this.selectedLocation; },
      closeAddTipp() {
        this.location = null;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      },
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
  }

  .map-search__icon {
    display: block;
    max-width: none;
    width: 18px;
    height: 18px;
    margin: 0 $golden-em/2;
  }

</style>
