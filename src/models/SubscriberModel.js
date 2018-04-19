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
    unique: true,
  },
});

SubscriberSchema.post('save', (error, doc, next) => {
  if (error.code === 11000) {
    next(new Error('Das Email isch scho registriert'));
  } else {
    next(error);
  }
});

export default mongoose.model('Subscriber', SubscriberSchema);
