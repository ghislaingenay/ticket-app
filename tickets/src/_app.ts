import express from 'express';
// Fix the async issues
import { json } from 'body-parser';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import {
  errorHandler,
  NotFoundError,
  currentUser,
  requireAuth
} from '@gg-tickets/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes/index';

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
app.use(currentUser);
// Routes
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
