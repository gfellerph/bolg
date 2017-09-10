// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Map from '@/components/Map';
import Bookmark from '@/components/Bookmark';
import Subscribe from '@/components/Subscribe';
import store from '@/config/store';
import '@/config/validation';

Vue.config.productionTip = false;

const mapElement = document.getElementById('map');
const bookmarkElement = document.getElementById('bookmark');
const subscribeElement = document.getElementById('subscribe');

/* eslint-disable no-new */
if (mapElement) {
  new Vue({
    el: '#map',
    store,
    template: '<Map/>',
    components: { Map },
  });
}

if (bookmarkElement) {
  new Vue({
    el: '#bookmark',
    store,
    template: '<Bookmark/>',
    components: { Bookmark },
  });
}

if (subscribeElement) {
  new Vue({
    el: '#subscribe',
    template: '<Subscribe/>',
    components: { Subscribe },
  });
}
