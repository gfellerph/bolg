import mongoose from 'mongoose';
import shortid from 'shortid';

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

export default mongoose.model('Image', ImageSchema);
