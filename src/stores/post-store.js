import axios from 'axios';
import debounce from 'debounce';

export default {
  state: {
    post: null,
  },
  mutations: {
    POST_SET_TITLE_IMAGE: (state, action) => { state.post.titleImage = action.image },
    POST_EDIT: (state, post) => { state.post = { ...state.post, ...post } },
  },
  actions: {
    POST_GET: async ({ commit }, id) => {
      const res = await axios.get(`/api/post/${id}`)
      commit('POST_EDIT', res.data);
      return res;
    },
    POST_WRITE: ({ commit, dispatch }, markdown) => {
      commit('POST_EDIT', { markdown, lastEdited: Date.now() });
      dispatch('POST_DEBOUNCED_SAVE');
    },
    POST_DEBOUNCED_SAVE: debounce(({ dispatch }) => dispatch('POST_PUT'), 2000),
    POST_PUT: async ({ commit, state }) => {
      const res = await axios.put(`/api/post/${state.post._id}`, state.post);
      // Only update the last saved date, other properties might have been
      // changed during the save
      commit('POST_EDIT', { lastSaved: res.data.lastSaved });
      return res;
    },
    POST_POST: async ({ commit, state }) => {
      const res = await axios.post('/api/post', state.post);
      commit('POST_EDIT', res.data);
      return res;
    },
  },
}
