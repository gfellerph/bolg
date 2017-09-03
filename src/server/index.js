import fs from 'fs';
import path from 'path';
import moment from '@/config/moment';
import firebase from '@/config/firebase-admin';
import * as hbsTemplates from '@/config/handlebars';
import writefile from './writefile';
import Post from '@/models/Post';
import * as helpers from './helpers';
import { slugger } from '@/config/constants';
import enqueueNotifications from '@/server/mails';

const cssInlineThreshold = 10; // KB
const logoURL = helpers.logoURL;
const database = firebase.database();
const publishedRef = database.ref('/published').orderByChild('created');

function inlineCSS(file) {
  if (!file.endsWith('.css')) return '';

  const filePath = path.resolve(process.cwd() + '/public' + file);
  const fileStats = fs.statSync(filePath);
  let html = '';

  if (fileStats.size / 1000.0 < cssInlineThreshold) {
    // Inline the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    html = `<style>${fileContent}</style>`;
  } else {
    html = `<link rel="stylesheet" href="${file}">`;
  }

  return html;
}

export function webpackManifest() {
  const manifest = JSON.parse(fs.readFileSync('public/config/webpack.manifest.json', 'utf8'));
  Object.keys(manifest).map((entry) => {
    manifest[entry] = entry.endsWith('.css') ? inlineCSS(manifest[entry]) : manifest[entry];
  });

  return manifest;
}

export function buildGallery() {
  return new Promise((resolve) => {
    publishedRef.once('value', (snapshot) => {
      const val = snapshot.val();
      const postsArray = Object.keys(val).map(key => val[key]).reverse();
      const postsPerMonth = {};
      const filePath = 'public/galerie.html';

      postsArray.map((post) => {
        const createdDate = moment(post.created, 'DD.MM.YYYY');
        const month = createdDate.month();
        const year = createdDate.year();
        const monthName = `${moment.months(month)} ${year}`;
        if (!postsPerMonth[monthName]) postsPerMonth[monthName] = [];
        post.images.map(image => postsPerMonth[monthName].push(image));
      });

      const html = hbsTemplates.gallery({
        postsPerMonth,
        logoURL: logoURL(),
        webpack: webpackManifest(),
      });

      resolve(writefile(filePath, html));
    });
  });
}

/**
 * Build the index page
 * @returns {Promise} Promise resolved when the file is written to disk
 */
export function buildIndex() {
  return new Promise((resolve, reject) => {
    publishedRef.once('value', (snapshot) => {
      const val = snapshot.val();
      const filePath = 'public/index.html';
      const posts = Object.keys(val).map(post => new Post(val[post])).reverse();
      const manifest = webpackManifest();
      const html = hbsTemplates.index({
        posts,
        logoURL: logoURL(),
        webpack: manifest,
      });
      writefile(filePath, html).then(resolve).catch(reject);
    });
  });
}

/**
 * Build a single post based on a post object
 * @param {Post} post - The current post
 * @param {Post} nextPost - Next post in line for the preview
 * @returns {Promise} Resolves when the file is written to disk
 */
export function buildPost(post, nextPost) {
  if (!post) throw new Error(`Post with id ${post} not found, can't touch this.`);

  const filePath = `public/posts/${slugger(post.title)}.html`;
  const html = hbsTemplates.post({
    post,
    nextPost,
    logoURL: logoURL(),
    webpack: webpackManifest(),
  });

  return writefile(filePath, html);
}

// Fetch post data from firebase and rebuild a single post
export function publish(id) {
  return new Promise((resolve) => {
    publishedRef.once('value', (snapshot) => {
      const value = snapshot.val();
      const posts = Object.keys(value).map(post => value[post]).reverse();
      let post = null;
      let nextPost = null;
      let lastPost = null;

      // Get current and next post
      for (let i = 0; i < posts.length; i += 1) {
        if (posts[i].id === id) {
          post = new Post(posts[i]);
          if (posts[i - 1]) nextPost = new Post(posts[i - 1]);
          if (posts[i + 1]) lastPost = new Post(posts[i + 1]);
        }
      }

      buildPost(post, nextPost)
        .then(() => {
          return lastPost ? buildPost(lastPost, post) : true;
        })
        .then(resolve);
    });
  });
}

export function publishAll() {
  const blogTasks = [];

  return new Promise((resolve, reject) => {
    publishedRef.once('value', (snapshot) => {
      const val = snapshot.val();
      if (!val) return new Error('There are no posts to build');
      const posts = Object.keys(val);

      for (let i = 0; i < posts.length; i += 1) {
        blogTasks.push(publish(posts[i]));
      }

      return Promise.all(blogTasks)
        .then(resolve)
        .catch(reject);
    });
  });
}

export function unpublish(id) {
  return new Promise((resolve, reject) => {
    database.ref(`/posts/${id}`)
      .once('value', (snapshot) => {
        const val = snapshot.val();
        if (!val) return new Error('This post is deleted or something');
        const post = new Post(val);
        const filepath = `public/posts/${slugger(post.title)}.html`;
        fs.unlink(filepath, (err) => {
          if (err && err.code === 'ENOENT') return resolve();
          if (err) reject(err);
          return resolve();
        });
      });
  });
}

// TODO: remove constant connection to firebase. listen only to
// http requests from the backend, this is much more efficient
publishedRef.on('child_added', (snapshot) => {
  const post = new Post(snapshot.val());
  publish(post.id)
    .then(buildIndex)
    .then(buildGallery)
    // .then(() => enqueueNotifications(post))
    .catch((error) => {
      console.error(error);
    })
});

publishedRef.on('child_removed', (snapshot) => {
  const post = snapshot.val();
  unpublish(post.id).then(buildIndex).then(buildGallery);
});

publishedRef.on('child_changed', (snapshot) => {
  const post = snapshot.val();
  publish(post.id).then(buildIndex).then(buildGallery);
});
