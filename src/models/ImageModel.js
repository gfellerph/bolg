import mongoose from 'mongoose';
import shortid from 'shortid';
import { getThumbUrl, getSrcset } from 'src/config/constants';

const { Schema } = mongoose;

export const ImageSchema = new Schema({
  name: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    required: true,
  },
  shortid: {
    type: String,
    default: shortid.generate,
  },
});

ImageSchema.virtual('thumbUrl').get(function thumbUrl() {
  return getThumbUrl(this.url, 640);
});

ImageSchema.virtual('srcset').get(function srcset() {
  return getSrcset(this.url);
});

export default mongoose.model('Image', ImageSchema);
