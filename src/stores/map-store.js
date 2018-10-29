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
    info: false,
  },
  mutations: {
    UPDATE_FILTER: (state, action) => { state.filter = action.filter },
    UPDATE_INFO: (state, action) => { state.info = action.info },
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
    },
    LOAD_TIPPS: async ({ state, commit }) => {
      if (state.tippsLoaded) return;

      let { data: tipps } = await axios.get('/api/tipps')
      // .catch(err => console.log(err));

      // Add title
      tipps = tipps.map((tipp) => {
        const abbr = tipp.text.substring(0, 22);
        tipp.title = `${tipp.name}s Tipp: ${abbr}${tipp.text.length > 22 ? '...' : ''}`;
        return tipp;
      });

      commit('UPDATE_TIPPS', { tipps });
    },
  },
}
