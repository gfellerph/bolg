const functions = require('firebase-functions');
const storage = require('@google-cloud/storage')();

// https://github.com/firebase/functions-samples/blob/master/generate-thumbnail/functions/index.js
// https://ericportis.com/posts/2014/srcset-sizes/
exports.createThumbnails = functions.storage.object().onChange(event => {
  const filePath = event.data.name;
  console.log(filePath);
});
