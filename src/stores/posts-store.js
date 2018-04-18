import axios from 'axios';

export default {
  state: {
    posts: [],
  },
  mutations: {
    POSTS_UPDATE: (state, posts) => { state.posts = posts },
    POSTS_UPDATE_ONE: (state, newPost) => {
      /* eslint no-confusing-arrow: 0 */
      state.posts = state.posts.map(post => newPost._id === post._id ? newPost : post);
    },
    POSTS_DELETE: (state, id) => { state.posts = state.posts.filter(post => post._id !== id); },
  },
  actions: {
    GETPOSTS: async ({ commit }) => {
      const res = await axios.get('/api/posts');
      commit('POSTS_UPDATE', res.data);
    },
    POSTS_PUBLISH: async ({ commit }, id) => {
      const res = await axios.get(`/api/publish/${id}`);
      commit('POSTS_UPDATE_ONE', res.data);
    },
    POSTS_DELETE_ONE: async ({ commit }, id) => {
      const res = await axios.delete(`/api/post/${id}`);
      commit('POSTS_DELETE', id);
      return res;
    },
  },
}
