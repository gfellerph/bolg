// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import GoogleMap from 'src/components/Map';
import Subscribe from 'src/components/Subscribe';
import 'src/config/validation';
import { setBookmarkFlag } from 'src/modules/bookmark';
import lqip from 'src/modules/lqip';

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
  lqip();
});
