
/* eslint no-param-reassign: 0 */
export default {
  state: {
    connected: navigator.onLine,
  },
  mutations: {
    ONLINE(state) {
      state.connected = true;
    },

    OFFLINE(state) {
      state.connected = false;
    },
  },
};
