import mongoose from 'mongoose';
import { Password } from '../services/password';
// An interface that describes the properties that are required to create a new User
interface UserAttrs {
  email: string;
  password: string;
}

// Interface that describe the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// Interface that describes the properties that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Not possible to add ES6 syntax, otherwise it will be overwritten (context of the file)
userSchema.pre('save', async function (done) {
  // hash the password if it is has been modified
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('users', userSchema);

export default User;
