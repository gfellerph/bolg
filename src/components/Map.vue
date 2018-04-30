<template>
  <div class="map">
    <transition
      name="slide-in-top"
    >
      <map-search
        v-if="!selectedTipp"
        ref="mapSearch"
        :map="map"
        :test="'test'"
      ></map-search>
    </transition>
    <div id="google-map"></div>
    <transition
      name="slide-in"
    >
      <map-tipp-detail
        v-if="selectedTipp"
        :tipp="selectedTipp"
        @close="closeTippDetail"
      />
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import bus from 'src/config/bus';
  import Tipp from 'src/models/Tipp';
  import AddTipp from 'src/components/AddTipp';
  import MapSearch from 'src/components/MapSearch';
  import MapTippDetail from 'src/components/MapTippDetail';
  import { mapConfig, polylineConfig, lineMarkerConfig } from 'src/config/map';
  import { unique } from 'src/modules/group-by';

  /* global google */

  export default {
    data() {
      return {
        markers: [],
        polyline: null,
        map: null,
        selectedTipp: null,
      };
    },

    mounted() {
      this.map = new google.maps.Map(document.getElementById('google-map'), mapConfig);

      this.$refs.mapSearch.init(this.map);

      if (window.outerWidth >= 768) this.map.addListener('click', this.addTipp);

      // Close tipp
      this.map.addListener('click', this.closeTippDetail);

      axios.get('/api/journeys')
        .then((res) => {
          const journey = res.data;
          const { lat, lng } = res.data[res.data.length - 1];
          this.map.setCenter(new google.maps.LatLng(lat, lng))

          const path = journey.map(location => ({ lat: location.lat, lng: location.lng }));
          this.polyline = new google.maps.Polyline(Object.assign(
            {},
            polylineConfig,
            {
              path,
              map: this.map,
            },
          ));

          const groupedMarkers = unique(journey, marker => [
            marker.description,
            marker.lat,
            marker.lng,
          ]);

          groupedMarkers.map(location => new google.maps.Marker(Object.assign(
            {},
            lineMarkerConfig,
            {
              position: new google.maps.LatLng(location.lat, location.lng),
              map: this.map,
              title: location.description,
            },
          )));
        })

      axios.get('/api/tipps')
        .then((res) => {
          const tipps = res.data;

          this.markers = tipps.map((tippData) => {
            const tipp = new Tipp(tippData);
            const marker = new google.maps.Marker({
              position: new google.maps.LatLng(tipp.lat, tipp.lng),
              map: this.map,
              title: tipp.title(),
              tipp,
              icon: {
                url: '/img/inuksuk-map.svg',
                size: new google.maps.Size(36, 34),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(18, 17),
              },
            });
            marker.addListener('click', (event) => {
              this.selectedTipp = tipp;
              console.log(event, tipp);
            });

            return marker;
          });
        });
    },

    methods: {
      addTipp(event) {
        bus.$emit('map-click', event.latLng);
      },
      closeTippDetail() {
        this.selectedTipp = null;
      },
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
    @include max($xxs) {
      padding-top: 51px;
    }
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
