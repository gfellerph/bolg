import mongoose from 'mongoose';
import { ImageSchema } from 'src/models/ImageModel';
import { UserSchema } from 'src/models/UserModel';

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
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  markdown: {
    type: String,
    default: '',
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  titleImage: {
    type: String,
    default: '',
  },
  images: [ImageSchema],
  drawings: [ImageSchema],
});

PostSchema.pre('validate', function preSave(next) {
  const title = this.markdown.match(/^# .+/gm);
  this.title = title ? title[0].replace('# ', '') : '';
  console.log(`this: ${this}`)
  next();
});

export default mongoose.model('Post', PostSchema);
