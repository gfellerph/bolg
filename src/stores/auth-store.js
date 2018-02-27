import User from 'src/models/User';
import axios from 'axios';

/* eslint no-param-reassign: 0 */
export default {
  state: {
    authenticated: false,
    user: new User(),
    mongoUser: null,
  },
  mutations: {
    LOGIN(state, action) {
      state.authenticated = true;
      state.user = new User(action.user);
    },

    LOGOUT(state) {
      state.authenticated = false;
      state.user = new User();
    },

    UPDATE_PROFILE(state, action) {
      state.user = new User(action.user);
    },

    MONGOLOGIN(state, action) {
      state.mongoUser = action;
      axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
    },

    MONGOLOGOUT(state) {
      state.mongoUser = null;
      window.localStorage.setItem('token', null);
    },
  },
};
