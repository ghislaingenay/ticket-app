import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new User
interface UserAttrs {
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

const User = mongoose.model('users', userSchema);

// For type checking in TypeScript bc Mongoose and TS types aren't properly linked
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};
export default User;
