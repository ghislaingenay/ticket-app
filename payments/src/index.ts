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
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
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
  // Listening port
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
