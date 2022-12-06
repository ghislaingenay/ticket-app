import express from 'express';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

import { json } from 'body-parser';

const app = express();

// Middleware
app.use(json());

// Routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Listening port
app.listen(3000, () => {
  console.log('v1');
  console.log('Listening on port 3000');
});
