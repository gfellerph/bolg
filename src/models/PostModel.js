import mongoose from 'mongoose';
import dateformat from 'dateformat';
import mongoosePaginate from 'mongoose-paginate';
import { ImageSchema } from 'src/models/ImageModel';
import { slugger } from 'src/config/constants';
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
    default: Date.now,
  },
  lastSaved: {
    type: Number,
    default: Date.now,
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
  titleImage: {
    type: ImageSchema,
  },
  images: [ImageSchema],
  drawings: [ImageSchema],
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
  },
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

PostSchema.plugin(mongoosePaginate);

PostSchema.virtual('isPublished').get(function isPublished() {
  return this.lastPublished !== null && this.publishedMarkdown !== '';
});

PostSchema.virtual('url').get(function getUrl() {
  return `/gschichte/${slugger(this.title)}`;
});

PostSchema.virtual('liveUrl').get(function liveUrl() {
  return `https://bisnär.ch${this.url}`;
});

PostSchema.virtual('galleryUrl').get(function galleryUrl() {
  return `/bilder/${slugger(this.title)}`;
});

PostSchema.virtual('galleryLiveUrl').get(function galleryLiveUrl() {
  return `https://bisnär.ch${this.galleryUrl}`;
});

PostSchema.virtual('html').get(function getHtml() {
  if (!this.isPublished || !this.publishedMarkdown) return '';
  return marked(this.publishedMarkdown, { lqip: true });
});

PostSchema.virtual('excerpt').get(function getExcerpt() {
  if (!this.publishedMarkdown) return '';
  return excerpt(this.publishedMarkdown);
});

PostSchema.virtual('description').get(function getDescription() {
  if (!this.publishedMarkdown) return '';
  return description(this.publishedMarkdown);
});

PostSchema.virtual('formattedPostDate').get(function getFormattedPostDate() {
  return dateformat(this.postDate, 'dd.mm.yyyy');
});

export default mongoose.model('Post', PostSchema);
