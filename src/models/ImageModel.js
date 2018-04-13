import mongoose from 'mongoose';
import shortid from 'shortid';
import { getThumbUrl, getSrcset, constructThumborUrl } from 'src/config/constants';

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

ImageSchema.virtual('srcset').get(function srcset() {
  return getSrcset(this.url);
});

ImageSchema.methods.getThumbnail = function getThumbnail(size) {
  return getThumbUrl(this.url, size);
}

ImageSchema.methods.getThumborUrl = function getThumborUrl(options) {
  return constructThumborUrl(this.url, options);
}

export default mongoose.model('Image', ImageSchema);
