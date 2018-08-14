<template>
  <div class="map">
    <transition
      name="slide-in-top"
    >
      <map-search
        v-if="!selectedTipp.tipp"
        ref="mapSearch"
        :map="map"
      ></map-search>
    </transition>
    <div id="google-map"></div>
    <transition
      name="slide-in"
    >
      <map-tipp-detail
        v-if="selectedTipp.tipp"
        :tipp="selectedTipp.tipp"
        @close="closeTippDetail"
      />
    </transition>
  </div>
</template>

<script>
  import bus from 'src/config/bus';
  import AddTipp from 'src/components/AddTipp';
  import MapSearch from 'src/components/MapSearch';
  import MapTippDetail from 'src/components/MapTippDetail';
  import { mapConfig, inuksukConfig, polylineConfig, lineMarkerConfig } from 'src/config/map';
  import { mapState, mapActions } from 'vuex';
  import offsetCenter from 'src/modules/map-offset';

  /* global google */
  export default {
    data() {
      return {
        polyline: null,
        journeyMarkers: [],
        tippMarkers: [],
        markers: [],
        map: null,
        selectedTipp: {
          marker: null,
          tipp: null,
        },
      };
    },

    mounted() {
      this.map = new google.maps.Map(document.getElementById('google-map'), mapConfig);

      // Init search input
      this.$refs.mapSearch.init(this.map);

      // Add tipp listener but not on mobile
      if (window.outerWidth >= 768) this.map.addListener('click', this.addTipp);

      // Close tipp listener
      this.map.addListener('click', this.closeTippDetail);

      // Init filter
      this.filterChange();
    },

    watch: {
      filter() {
        this.filterChange();
      },
      selectedTipp(newTipp, oldTipp) {
        if (oldTipp && oldTipp.marker) {
          oldTipp.marker.setIcon(inuksukConfig('/img/inuksuk-map.svg'));
        }
        if (newTipp && newTipp.marker) {
          newTipp.marker.setIcon(inuksukConfig('/img/inuksuk-inverted.svg'));
          let newPosition = null;
          const markerPosition = newTipp.marker.position;
          const screenWidth = window.screen.width;
          const screenHeight = window.screen.height;
          if (screenWidth > 768) {
            newPosition = offsetCenter(markerPosition, screenWidth / 6, 0, this.map);
          } else {
            newPosition = offsetCenter(markerPosition, 0, screenHeight / 4, this.map);
          }
          this.map.panTo(newPosition);
        }
      },
    },

    computed: {
      ...mapState({
        tipps: state => state.mapStore.tipps,
        journey: state => state.mapStore.journey,
        journeyPoints: state => state.mapStore.journeyPoints,
        filter: state => state.mapStore.filter,
      }),
    },

    methods: {
      addTipp(event) {
        bus.$emit('map-click', event.latLng);
      },
      closeTippDetail() {
        this.selectedTipp = {
          tipp: null,
          marker: null,
        };
      },
      filterChange() {
        switch (this.filter) {
          case 'tipps':
            this.LOAD_TIPPS()
              .then(this.renderTipps);
            break;
          case 'journey':
            this.LOAD_JOURNEY()
              .then(this.renderJourney);
            break;
          default:
            break;
        }
      },
      renderTipps() {
        // Clean up
        if (this.journeyMarkers.length) {
          this.journeyMarkers.forEach((marker) => { marker.setMap(null); });
        }
        if (this.polyline) this.polyline.setMap(null);

        // Shortcut if already initialised
        if (this.tippMarkers.length) {
          this.tippMarkers.forEach((marker) => { marker.setMap(this.map); });
          return;
        }

        this.tippMarkers = this.tipps.map((tipp) => {
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(tipp.lat, tipp.lng),
            map: this.map,
            title: tipp.title,
            tipp,
            icon: inuksukConfig('/img/inuksuk-map.svg'),
          });

          marker.addListener('click', () => {
            this.selectedTipp = {
              tipp,
              marker,
            };
            marker.setIcon(inuksukConfig('/img/inuksuk-inverted.svg'));
          });

          return marker;
        });
      },
      renderJourney() {
        // Cleanup
        if (this.tippMarkers.length) {
          this.tippMarkers.forEach((marker) => { marker.setMap(null); });
        }

        if (this.polyline) {
          // Shortcut if already initialised
          this.polyline.setMap(this.map);
        } else {
          this.polyline = new google.maps.Polyline(Object.assign(
            {},
            polylineConfig,
            {
              path: this.journey,
              map: this.map,
            },
          ));
        }

        if (this.journeyMarkers.length) {
          this.journeyMarkers.forEach((marker) => { marker.setMap(this.map) });
        } else {
          this.journeyMarkers = this.journeyPoints.map(point => new google.maps.Marker(Object.assign(
            {},
            lineMarkerConfig,
            {
              position: new google.maps.LatLng(point.lat, point.lng),
              map: this.map,
              title: point.description,
            },
          )));
        }
      },
      ...mapActions(['LOAD_JOURNEY', 'LOAD_TIPPS']),
    },

    components: {
      AddTipp,
      MapSearch,
      MapTippDetail,
    },
  };
</script>

<style lang="scss">
  @import 'src/styles/core/_index';

  .gm-style {
    font: inherit !important;
  }

  .gm-style-iw {
    > div > div {
      h5 {
        font-size: 1.5em;
        margin-top: 1em;
      }

      p {
        font-size: inherit !important;
        margin-bottom: 1em;
      }
    }
  }

  .map {
    overflow: hidden;
  }

  .slide-in-enter-active,
  .slide-in-leave-active,
  .slide-in-top-enter-active,
  .slide-in-top-leave-active {
    transition: transform .5s, opacity .5s;
  }
  .slide-in-enter,
  .slide-in-leave-to {
    opacity: 0;
    @include max($xs) {
      transform: translate3d(0, 100vh, 0);
    }
    @include min($xs) {
      transform: translate3d(-40vw, 0, 0);
    }
  }
  .slide-in-top-enter,
  .slide-in-top-leave-to {
    transform: translate3d(0, -200%, 0);
    opacity: 0;
  }
</style>
