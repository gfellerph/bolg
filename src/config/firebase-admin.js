import admin from 'firebase-admin';

const serviceAccount = require('./firebase-admin-key.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bolg-d1098.firebaseio.com',
    storageBucket: 'bolg-d1098.appspot.com',
  });
}

export default admin;
