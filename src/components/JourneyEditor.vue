<template>
  <div class="journey-editor">
    <div id="google-map"></div>
    <div
      class="journey-form floating-form map__box"
      v-if="location"
    >
      <p>
        <label for="date">Datum</label>
        <input
          id="date"
          type="date"
          ref="date"
          v-model="journey.date"
        >
      </p>
      <p>
        <label for="desc">Beschrieb</label>
        <input
          id="desc"
          type="text"
          v-model="journey.description"
        >
      </p>
      <p class="error" v-if="error">{{error}}</p>
      <div class="floating-form__controls">
        <button
          @click="cancel"
        >Abbräche</button>
        <button
          :disabled="loading"
          @click="submit"
        >Schicke</button>
      </div>
    </div>
    <ul class="journey-editor__list">
      <li
        v-for="journey in journeys"
        :key="journey._id"
      >
        <journey-point-editor
          :journey="journey"
          @journey-update="updateJourneys"
        ></journey-point-editor>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import Journey from 'src/models/Journey';
import JourneyPointEditor from 'src/components/JourneyPointEditor';
import { mapConfig, polylineConfig } from 'src/config/map';

/* global google */

export default {
  components: { JourneyPointEditor },
  data() {
    return {
      location: false,
      journey: new Journey(),
      journeys: [],
      loading: false,
      error: false,
      marker: null,
      map: null,
      polyline: null,
      markers: null,
    };
  },

  mounted() {
    this.map = new google.maps.Map(document.getElementById('google-map'), mapConfig);
    this.map.addListener('click', this.addJourney);
    this.updateJourneys();
  },

  watch: {
    location(val) {
      if (!val && !this.marker) return;

      // Reset marker
      if (!val && this.marker) {
        this.marker.setMap(null);
      }

      // Create marker
      if (val && !this.marker) {
        this.marker = new google.maps.Marker({
          title: 'Route hie hinzuefüege?',
        })
      }

      // Marker already exists, just move it
      this.marker.setPosition(val);
      this.marker.setMap(this.map);
    },
    journeys(val) {
      if (this.polyline) this.polyline.setMap(null);
      if (this.markers) this.markers.map(marker => marker.setMap(null));

      const path = val.map(location => ({ lat: location.lat, lng: location.lng }));
      this.polyline = new google.maps.Polyline(Object.assign(polylineConfig, {
        path,
      }));
      this.markers = val.map(location => new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        map: this.map,
        icon: {
          url: '/img/dot.png',
          size: new google.maps.Size(11, 11),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(5.5, 5.5),
        },
        title: `${location.shortDate} - ${location.description}`,
      }));

      this.polyline.setMap(this.map);
    },
  },

  methods: {
    updateJourneys() {
      return axios.get('/api/journeys').then((res) => { this.journeys = res.data });
    },
    addJourney(event) {
      this.location = event.latLng;
      this.$nextTick(() => this.$refs.date.focus())
    },
    cancel() {
      this.location = null;
    },
    submit() {
      if (!this.location) {
        this.error = 'Kei location';
        return;
      }
      this.journey.lat = this.location.lat();
      this.journey.lng = this.location.lng();
      this.error = false;
      this.loading = true;
      axios.post('/api/journey', this.journey)
        .then(this.updateJourneys)
        .then(() => {
          this.loading = false;
          this.journey = new Journey();
          this.cancel();
        })
        .catch((err) => {
          this.error = err.message;
          this.loading = false;
        });
    },
  },
}
</script>

<style lang="scss" scoped>
  @import 'src/styles/core/_index';
  @import 'src/styles/molecules/floating-form';

  .journey-editor__list {
    list-style: none;
    padding: 0 $golden-rem/2;
  }

  .journey-editor {
    position: relative;
    flex: 1 0 auto;
  }

  .journey-form {
    position: absolute;
    top: 2rem;
    left: 2rem;
  }

  #google-map {
   width: 100%;
   height: 80vh;
  }
</style>
