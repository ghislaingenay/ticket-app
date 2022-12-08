import express from 'express';
// Fix the async issues
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@gg-tickets/common';

const app = express();

// Middleware
app.set('trust proxy', true); // Traffic is being proxied through by ingress-nginx => express is aware that ingress-nginx and trust contents
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test' // Throw err if secure/ true (only https)
  })
);
// Routes

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
