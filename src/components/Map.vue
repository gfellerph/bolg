<template>
  <div class="map">
    <map-search
      ref="mapSearch"
      :map="map"
      :test="'test'"
    ></map-search>
    <div id="google-map"></div>
  </div>
</template>

<script>
  import axios from 'axios';
  import bus from 'src/config/bus';
  import Tipp from 'src/models/Tipp';
  import AddTipp from 'src/components/AddTipp';
  import MapSearch from 'src/components/MapSearch';
  import { mapConfig, polylineConfig, lineMarkerConfig } from 'src/config/map';
  import { unique } from 'src/modules/group-by';

  /* global google */

  export default {
    data() {
      return {
        markers: [],
        polyline: null,
        map: null,
      };
    },

    mounted() {
      this.map = new google.maps.Map(document.getElementById('google-map'), mapConfig);

      this.$refs.mapSearch.init(this.map);

      if (window.outerWidth >= 768) this.map.addListener('click', this.addTipp);

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
              icon: {
                url: '/img/inuksuk-map.svg',
                size: new google.maps.Size(36, 34),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(18, 17),
              },
            });
            const infowindow = new google.maps.InfoWindow({
              content: `
                <h5>${tipp.name}</h5>
                <p>${tipp.text}</p>
              `,
            });
            marker.addListener('click', () => {
              infowindow.open(this.map, marker);
            });

            return marker;
          });
        });
    },

    methods: {
      addTipp(event) {
        bus.$emit('map-click', event.latLng);
      },
    },

    components: {
      AddTipp,
      MapSearch,
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
    @include max($xxs) {
      padding-top: 51px;
    }
  }
</style>
