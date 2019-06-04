import mongoose from 'mongoose';

const { Schema } = mongoose;

const CountrySchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
  },
  titleText: {
    type: String,
  },
});

export default mongoose.model('Country', CountrySchema);
