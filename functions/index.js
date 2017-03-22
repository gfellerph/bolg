const functions = require('firebase-functions');
const request = require('request');

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 const token = "80mg7KF-3xCnm8dJahu2rg";
 request.post({
     url: 'https://api.travis-ci.org/repo/tuelsch%2Fbolg/requests',
     body: JSON.stringify({request: {branch: 'master', token: token}}),
     headers: {
        'Travis-API-Version': 3,
        'Authorization': 'token ' + token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
     }
    }, function (err, res, body) {
     if (err) {
         response.send(err.message);
     }

     response.send(JSON.stringify(res) + JSON.stringify(body));
 });
});
