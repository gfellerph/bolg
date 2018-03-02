import mongoose from 'mongoose';
import shortid from 'shortid';

const { Schema } = mongoose;

export const ImageSchema = new Schema({
  id: { type: String, unique: true },
  url: String,
  thumbnails: [Object],
});

ImageSchema.pre('save').set(function setId(next) {
  this.id = this.id ? this.id : shortid.generate();
  next();
});

export default mongoose.model('Image', ImageSchema);
