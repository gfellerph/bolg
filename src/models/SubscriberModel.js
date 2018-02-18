import mongoose from 'mongoose';

const { Schema } = mongoose;

const SubscriberSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Subscriber', SubscriberSchema);
