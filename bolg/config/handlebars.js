const fs = require('fs');
const handlebars = require('handlebars');
const layouts = require('handlebars-layouts');

const layout = fs.readFileSync('./bolg/templates/_layout.hbs', 'utf-8');
const index = fs.readFileSync('./bolg/templates/index.hbs', 'utf-8');
const post = fs.readFileSync('./bolg/templates/post.hbs', 'utf-8');

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', layout);

module.exports = {
  index: handlebars.compile(index),
  post: handlebars.compile(post),
};
