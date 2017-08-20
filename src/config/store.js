import 'es6-promise/auto';
import Vuex from 'vuex';

import authStore from '@/stores/auth-store';
import connectionStore from '@/stores/connection-store';

// Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    auth: authStore,
    connection: connectionStore,
  },
});
