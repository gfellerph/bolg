import mongoose from 'mongoose';
import shortid from 'shortid';
import { ThumbnailSchema } from 'src/models/ThumbnailModel';

const { Schema } = mongoose;

export const ImageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  shortid: {
    type: String,
    default: shortid.generate,
  },
  thumbnails: [ThumbnailSchema],
});

export default mongoose.model('Image', ImageSchema);
