import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

export const UserSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

UserSchema.pre('save', function preSave(next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) return next(saltErr);

      return bcrypt.hash(this.password, salt, (hashErr, hash) => {
        if (hashErr) return next(hashErr);

        this.password = hash;
        return next();
      })
    })
  } else {
    return next();
  }

  return null;
})

UserSchema.methods.comparePassword = function comparePassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, match) => {
      if (err) return reject(err);
      if (!match) return reject(new Error('You shall not pass'));

      return resolve(this);
    })
  });
}

export default mongoose.model('User', UserSchema);
