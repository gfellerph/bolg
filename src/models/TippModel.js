import mongoose from 'mongoose';

const { Schema } = mongoose;

export const TippSchema = new Schema({
  created: {
    type: Date,
    default: Date.now(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
  },
  text: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

export default mongoose.model('Tipp', TippSchema);
