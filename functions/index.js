const functions = require('firebase-functions');
const tools = require('firebase-tools');
const marked = require('marked');
const html = marked(readme, {sanitize: true});

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
})
