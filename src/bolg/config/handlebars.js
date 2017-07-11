const fs = require('fs');
const handlebars = require('handlebars');
const layouts = require('handlebars-layouts');

const layout = fs.readFileSync('src/bolg/templates/_layout.hbs', 'utf-8');
const indexTemplate = fs.readFileSync('src/bolg/templates/index.hbs', 'utf-8');
const postTemplate = fs.readFileSync('src/bolg/templates/post.hbs', 'utf-8');

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('layout', layout);

export const index = handlebars.compile(indexTemplate);
export const post = handlebars.compile(postTemplate);
