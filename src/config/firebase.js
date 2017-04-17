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
firebase.initializeApp(config);

Vue.use(vuefire);

export default firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const FacebookProvider = new firebase.auth.FacebookAuthProvider();
