import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';

import authStore from 'src/stores/auth-store';
import connectionStore from 'src/stores/connection-store';
import postsStore from 'src/stores/posts-store';
import postStore from 'src/stores/post-store';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    auth: authStore,
    connection: connectionStore,
    posts: postsStore,
    post: postStore,
  },
});
