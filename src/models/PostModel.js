import mongoose from 'mongoose';
import { ImageSchema } from 'src/models/ImageModel';
import { UserSchema } from 'src/models/UserModel';

const { Schema } = mongoose;

export const PostSchema = new Schema({
  id: { type: String, unique: true },
  title: { type: String, unique: true },
  created: Date,
  lastEdited: Date,
  lastSaved: Date,
  lastPublished: Date,
  author: UserSchema,
  markdown: String,
  images: [ImageSchema],
  html: String,
  notificationSent: Boolean,
  excerpt: String,
  description: String,
  titleImage: String,
  drawings: [ImageSchema],
});

PostSchema.pre('save', function preSave(next) {
  this.title = 'blah'; // Extract title
  next();
});

export default mongoose.model('Post', PostSchema);
