import mongoose from 'mongoose';
import dateformat from 'dateformat';
import { ImageSchema } from 'src/models/ImageModel';
import { slugger, formatDate } from 'src/config/constants';
import { marked, excerpt, description } from 'src/config/markdown';

const { Schema } = mongoose;

export const PostSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastEdited: {
    type: Number,
    default: null,
  },
  lastSaved: {
    type: Number,
    default: null,
  },
  lastPublished: {
    type: Number,
    default: null,
  },
  postDate: {
    type: String,
    default: () => dateformat(Date.now(), 'yyyy-mm-dd'),
  },
  markdown: {
    type: String,
    default: '',
  },

  // Enable simple versioning
  // (edit a post without affecting published version before publishing again)
  publishedMarkdown: {
    type: String,
    default: '',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  titleImage: ImageSchema,
  images: [ImageSchema],
  drawings: [ImageSchema],
});

PostSchema.virtual('isPublished').get(function isPublished() {
  return this.lastPublished !== null && this.publishedMarkdown !== '';
});

PostSchema.virtual('url').get(function getUrl() {
  return `/gschichte/${slugger(this.title)}`;
});

PostSchema.virtual('html').get(function getHtml() {
  if (!this.isPublished) return '';

  const images = this.images.reduce((acc, image) => {
    acc[image.id] = image.thumbnails;
    return acc;
  }, {});

  return marked(this.publishedMarkdown, { images });
});

PostSchema.virtual('excerpt').get(function getExcerpt() {
  return excerpt(this.publishedMarkdown);
});

PostSchema.virtual('description').get(function getDescription() {
  return description(this.publishedMarkdown);
});

PostSchema.virtual('formattedPostDate').get(function getFormattedPostDate() {
  return formatDate(this.postDate);
});

/**
 * Set the post title, extracted from markdown befor the post is saved.
 * The regex is looking for "# title" patterns
 *
 * @param {function} next Next middleware callback
 * @returns {void}
 */
PostSchema.pre('validate', function preSave(next) {
  const title = this.markdown.match(/^# .+/gm);
  this.title = title ? title[0].replace('# ', '') : '';
  next();
});

export default mongoose.model('Post', PostSchema);
