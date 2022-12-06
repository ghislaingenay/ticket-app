import express from 'express';
import 'express-async-errors';
// Fix the async issues
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

import mongoose, { Mongoose } from 'mongoose';

const app = express();

// Middleware
app.use(json());

// Routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
const start = async () => {
  await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  console.log('Connected to MongoDB');
};
// Listening port
app.listen(3000, () => {
  console.log('v1');
  console.log('Listening on port 3000');
});
