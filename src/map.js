// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Map from '@/components/Map';
import router from './config/router';
import store from './config/store';
import dateFormat from './filters/date-format';

Vue.filter('dateFormat', dateFormat);
Vue.config.productionTip = false;

const mapElement = document.getElementById('map');

/* eslint-disable no-new */
if (mapElement) {
  new Vue({
    el: '#map',
    store,
    router,
    template: '<Map/>',
    components: { Map },
  });
}
