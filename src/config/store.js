import 'es6-promise/auto';
import Vuex from 'vuex';

import authStore from 'src/stores/auth-store';
import connectionStore from 'src/stores/connection-store';

// Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    auth: authStore,
    connection: connectionStore,
  },
});
