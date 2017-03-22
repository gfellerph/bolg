import Vue from 'vue';
import Vuex from 'vuex';

import authStore from '@/stores/auth-store';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	modules: {
		auth: authStore,
	},
});
