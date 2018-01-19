import mongoose from 'mongoose';

const { Schema } = mongoose;

export const UserSchema = new Schema({
  created: { type: Date, default: Date.now },
  displayName: String,
  email: String,
});

export default mongoose.model('User', UserSchema);
