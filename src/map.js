// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import GoogleMap from 'src/components/Map';
import Subscribe from 'src/components/Subscribe';
import lqip from 'src/modules/lqip';
import mapStore from 'src/stores/map-store';
import { setBookmarkFlag } from 'src/modules/bookmark';
import 'src/config/validation';

Vue.config.productionTip = false;
Vue.use(Vuex);

window.addEventListener('DOMContentLoaded', () => {
  const mapElement = document.getElementById('map');
  const subscribeElement = document.getElementById('subscribe');

  /* eslint-disable no-new */
  if (mapElement) {
    new Vue({
      el: '#map',
      template: '<google-map/>',
      components: { GoogleMap },
      store: new Vuex.Store({
        strict: true,
        modules: {
          mapStore,
        },
      }),
    });
  }

  if (subscribeElement) {
    new Vue({
      el: '#subscribe',
      template: '<Subscribe/>',
      components: { Subscribe },
    });
  }
});

setBookmarkFlag();
lqip();
