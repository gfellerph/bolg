import User from '@/models/User';

export default {
  state: {
    authenticated: false,
    user: new User(),
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
  },
};
