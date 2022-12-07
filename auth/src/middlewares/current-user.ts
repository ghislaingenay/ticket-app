import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

declare global {
  // Reach into a existing type definition
  namespace Express {
    // Find the interface of Request inside Express and add new parameters
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// Middleware that extract the JWT payload and set it on 'req.currentUser'
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_TOKEN!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {}

  next();
};
