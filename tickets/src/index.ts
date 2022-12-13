import mongoose, { Mongoose } from 'mongoose';
import { app } from './_app';
const start = async () => {
  if (!process.env.JWT_TOKEN) {
    throw new Error('JWT_TOKEN must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
};

start();

// Listening port
app.listen(3000, () => {
  console.log('v1');
  console.log('Listening on port 3000');
});
