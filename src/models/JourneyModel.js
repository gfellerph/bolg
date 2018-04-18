import mongoose from 'mongoose';
import dateformat from 'dateformat';

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
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: { virtuals: true },
});

JourneySchema.virtual('shortDate')
  .get(function shortDate() {
    return dateformat(this.date, 'dd.mm.yy');
  });

JourneySchema.virtual('inputDate')
  .get(function inputDate() {
    return dateformat(this.date, 'yyyy-mm-dd');
  })
  .set(function setInputDate(value) {
    this.date = value;
  });

export default mongoose.model('Journey', JourneySchema);
