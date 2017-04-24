import firebase from 'firebase';
import Vue from 'vue';
import vuefire from 'vuefire';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBi6qxewP2GsezDpNuYqkOJPyfR2GuHTYw',
  authDomain: 'bolg-d1098.firebaseapp.com',
  databaseURL: 'https://bolg-d1098.firebaseio.com',
  storageBucket: 'bolg-d1098.appspot.com',
  messagingSenderId: '206693873851',
};

if (firebase.apps.length === 0) firebase.initializeApp(config);

Vue.use(vuefire);

export default firebase;
export const database = firebase.database ? firebase.database() : null;
export const auth = firebase.auth ? firebase.auth() : null;
export const storage = firebase.storage ? firebase.storage() : null;
export const GoogleProvider = firebase.auth ? new firebase.auth.GoogleAuthProvider() : null;
export const FacebookProvider = firebase.auth ? new firebase.auth.FacebookAuthProvider() : null;
