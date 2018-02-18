import mongoose from 'mongoose';

const { Schema } = mongoose;

const JourneySchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
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

export default mongoose.model('Journey', JourneySchema);
