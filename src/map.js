// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import GoogleMap from '@/components/Map';
import Subscribe from '@/components/Subscribe';
import '@/config/validation';
import { setBookmarkFlag } from '@/modules/bookmark';

Vue.config.productionTip = false;

const mapElement = document.getElementById('map');
const subscribeElement = document.getElementById('subscribe');

window.addEventListener('DOMContentLoaded', () => {
  /* eslint-disable no-new */
  if (mapElement) {
    new Vue({
      el: '#map',
      template: '<google-map/>',
      components: { GoogleMap },
    });
  }

  if (subscribeElement) {
    new Vue({
      el: '#subscribe',
      template: '<Subscribe/>',
      components: { Subscribe },
    });
  }

  setBookmarkFlag();
});
