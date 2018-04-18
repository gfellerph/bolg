import axios from 'axios';

/* eslint no-param-reassign: 0 */
export default {
  state: {
    user: null,
  },
  mutations: {
    LOGIN(state, action) {
      state.user = action.user;
      window.localStorage.setItem('token', action.token);
      axios.defaults.headers.common.Authorization = `Bearer ${action.token}`;
    },

    LOGOUT(state) {
      state.user = null;
      window.localStorage.setItem('token', '');
      axios.defaults.headers.common.Authorization = '';
    },
  },
  getters: {
    authenticated: state => !!state.user,
  },
  actions: {
    LOGIN({ commit }, credentials) {
      return axios.post('/api/user/authenticate', {
        email: credentials.email,
        password: credentials.password,
      })
        .then((res) => {
          commit('LOGIN', {
            user: res.data.user,
            token: res.data.token,
          });
        })
    },

    REFRESH({ commit }) {
      const token = window.localStorage.getItem('token');
      if (!token) return Promise.reject();
      return axios.get('/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          commit('LOGIN', {
            token,
            user: res.data,
          });
        })
        .catch(() => {
          commit('LOGOUT')
        });
    },
  },
};
