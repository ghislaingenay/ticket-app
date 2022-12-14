import mongoose, { Mongoose } from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { app } from './_app';

const start = async () => {
  if (!process.env.JWT_TOKEN) {
    throw new Error('JWT_TOKEN must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await natsWrapper.connect('tickets', 'hdjd', 'http://nats-srv:4222');
    // Add force shutdown
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    // When you try to close the client or disconnect from running server, verify if user restart server or close it
    process.on('SIGINT', () => natsWrapper.client.close());
    // SIG are signal sent to this process => intercept request on the program and close the program first and close the connection
    process.on('SIGTERM', () => natsWrapper.client.close());

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
