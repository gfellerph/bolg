var admin = require("firebase-admin");
var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bolg-d1098.firebaseio.com"
});

module.exports = admin;