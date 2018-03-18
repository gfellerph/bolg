import mongoose from 'mongoose';
import { ImageSchema } from 'src/models/ImageModel';
import { ThumbnailSchema } from 'src/models/ThumbnailModel';
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
    type: Date,
    default: null,
  },
  lastSaved: {
    type: Date,
    default: null,
  },
  lastPublished: {
    type: Date,
    default: null,
  },
  postDate: {
    type: Date,
    default: Date.now,
  },
  markdown: {
    type: String,
    default: '',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  titleImage: ThumbnailSchema,
  images: [ImageSchema],
  drawings: [ImageSchema],
});

PostSchema.virtual('url').get(function getUrl() {
  return `/gschichte/${slugger(this.title)}`;
});

PostSchema.virtual('html').get(function getHtml() {
  const images = this.images.reduce((acc, image) => {
    acc[image.id] = image.thumbnails;
    return acc;
  }, {});
  return marked(this.markdown, { images });
});

PostSchema.virtual('excerpt').get(function getExcerpt() {
  return excerpt(this.markdown);
});

PostSchema.virtual('description').get(function getDescription() {
  return description(this.markdown);
});

PostSchema.virtual('formattedPostDate').get(function getFormattedPostDate() {
  return formatDate(this.postDate);
});

PostSchema.pre('validate', function preSave(next) {
  const title = this.markdown.match(/^# .+/gm);
  this.title = title ? title[0].replace('# ', '') : '';
  next();
});

export default mongoose.model('Post', PostSchema);
