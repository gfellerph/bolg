import mongoose from 'mongoose';
import sizeOf from 'image-size';
import request from 'request-promise-native';
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
    required: true,
  },
  ratio: {
    type: Number,
    required: true,
  },
});

ImageSchema.virtual('srcset').get(function srcset() {
  return getSrcset(this.url);
});

ImageSchema.virtual('blurryThumb').get(function blurryThumb() {
  return constructThumborUrl(this.url, {
    width: 20,
    filters: {
      blur: 2,
    },
  });
});

ImageSchema.methods.getThumbnail = function getThumbnail(size) {
  if (this.url.indexOf('adie.bisnaer.ch/') < 0) return this.url;
  return getThumbUrl(this.url, size);
}

ImageSchema.methods.getThumborUrl = function getThumborUrl(options) {
  if (this.url.indexOf('adie.bisnaer.ch/') < 0) return this.url;
  return constructThumborUrl(this.url, options);
}

ImageSchema.methods.getBuffer = function getBuffer() {
  return request({
    url: this.blurryThumb,
    encoding: null,
  }).catch(console.log);
}

ImageSchema.methods.getRatio = async function getRatio() {
  if (this.ratio) return this.ratio;
  const { width, height } = sizeOf(await this.getBuffer());
  const ratio = height / width;
  return ratio;
}

ImageSchema.pre('validate', function preSave(next) {
  this.ratio = this.getRatio()
    .then(() => next())
    .catch(console.err);
});

export const ImageModel = mongoose.model('Image', ImageSchema);
