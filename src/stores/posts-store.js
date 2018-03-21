import axios from 'axios';

export default {
  state: {
    posts: [],
  },
  mutations: {
    POSTS: (state, action) => { state.posts = action.posts },
  },
  actions: {
    GETPOSTS: async ({ commit }) => {
      const res = await axios.get('/api/posts');
      commit('POSTS', { posts: res.data });
    },
  },
}
