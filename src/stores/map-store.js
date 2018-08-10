import axios from 'axios';
import { unique } from 'src/modules/group-by';

export default {
  state: {
    filter: 'tipps',
    state: '',
    journeyLoaded: false,
    tippsLoaded: false,
    journey: [],
    journeyPoints: [],
    tipps: [],
  },
  mutations: {
    UPDATE_FILTER: (state, action) => { state.filter = action.filter },
    UPDATE_STATE: (state, action) => { state.state = action.state },
    UPDATE_JOURNEY: (state, action) => {
      state.journeyLoaded = true;
      state.journey = action.journey;
      state.journeyPoints = action.journeyPoints;
    },
    UPDATE_TIPPS: (state, action) => {
      state.tippsLoaded = true;
      state.tipps = action.tipps;
    },
  },
  actions: {
    LOAD_JOURNEY: async ({ state, commit }) => {
      if (state.journeyLoaded) return;

      // Get journey data
      const { data: journeyData } = await axios.get('/api/journeys')
        .catch((err) => {
          console.log(err);
        });

      const journey = journeyData.map(location => ({
        lat: location.lat,
        lng: location.lng,
      }));

      const journeyPoints = unique(journeyData, marker => [
        marker.description,
        marker.lat,
        marker.lng,
      ]);

      commit('UPDATE_JOURNEY', {
        journey,
        journeyPoints,
      });

      /* this.polyline = new google.maps.Polyline(Object.assign({},
        polylineConfig, {
          path,
          map: this.map,
        },
      )); */

      /* groupedMarkers.map(location => new google.maps.Marker(Object.assign({},
        lineMarkerConfig, {
          position: new google.maps.LatLng(location.lat, location.lng),
          map: this.map,
          title: location.description,
        },
      ))); */
    },
    LOAD_TIPPS: async ({ state, commit }) => {
      if (state.tippsLoaded) return;

      let { data: tipps } = await axios.get('/api/tipps')
        .catch(err => console.log(err));

      // Add title
      tipps = tipps.map((tipp) => {
        const abbr = tipp.text.substring(0, 22);
        tipp.title = `${tipp.name}s Tipp: ${abbr}${tipp.text.length > 22 ? '...' : ''}`;
        return tipp;
      });

      commit('UPDATE_TIPPS', { tipps });

      /* this.markers = tipps.map((tippData) => {
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
        marker.addListener('click', () => {
          this.selectedTipp = {
            tipp,
            marker,
          };
          marker.setIcon({
            url: '/img/inuksuk-inverted.svg',
            size: new google.maps.Size(36, 34),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(18, 17),
          });
        });

        return marker;
      }); */
    },
  },
}
