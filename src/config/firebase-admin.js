import admin from 'firebase-admin';

const serviceAccount = require('./firebase-admin-key.json');

// Add private info from .env file (not in GIT)
serviceAccount.private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n');
serviceAccount.private_key_id = process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID;

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bolg-d1098.firebaseio.com',
    storageBucket: 'bolg-d1098.appspot.com',
  });
}

export const database = admin.database();
export const storage = admin.storage();
