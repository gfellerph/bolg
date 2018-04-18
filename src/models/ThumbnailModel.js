import mongoose from 'mongoose';
import shortid from 'shortid';

const { Schema } = mongoose;

export const ThumbnailSchema = new Schema({
  size: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortid: {
    type: String,
    default: shortid.generate,
  },
});

export default mongoose.model('Thumbnail', ThumbnailSchema);
