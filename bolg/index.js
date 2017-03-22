const marked = require('marked');
const fs = require('fs');
const request = require('request');
const firebase = require('firebase');
const handlebars = require('handlebars');
const layouts = require('handlebars-layouts');

// Initialize Firebase
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");
var config = {
  apiKey: "AIzaSyBi6qxewP2GsezDpNuYqkOJPyfR2GuHTYw",
  authDomain: "bolg-d1098.firebaseapp.com",
  databaseURL: "https://bolg-d1098.firebaseio.com",
  storageBucket: "bolg-d1098.appspot.com",
  messagingSenderId: "206693873851"
};
firebase.initializeApp(config);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bolg-d1098.firebaseio.com"
});

handlebars.registerHelper(layouts(handlebars));
const hbs = fs.readFileSync('bolg/post.hbs', 'utf-8');
const layout = fs.readFileSync('bolg/_layout.hbs', 'utf-8');
handlebars.registerPartial('layout', layout);
const template = handlebars.compile(hbs);

var postsRef = admin.database().ref('/posts').once('value', function (snapshot) {
  const posts = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
  
  posts.map(function (post) {
    const urlSlug = post.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    const html = template({markdown: marked(post.markdown, {sanitize: true})});
    
    fs.writeFileSync(`public/${urlSlug}.html`, html, {encoding: 'utf-8'});
  });
  process.exit();
}).catch(err => {throw err;});