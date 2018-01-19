import mongoose from 'mongoose';
import { UserSchema } from 'src/models/UserModel';

const { Schema } = mongoose;

export const TippSchema = new Schema({
  id: { type: String, unique: true },
  created: Date,
  user: UserSchema,
  text: String,
  lat: Number,
  lng: Number,
});

export default mongoose.model('Tipp', TippSchema);
