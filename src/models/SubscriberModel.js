import mongoose from 'mongoose';
import { UserSchema } from 'src/models/UserModel';

export default mongoose.model('Subscriber', UserSchema);
