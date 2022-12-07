import express, { Request, Response } from 'express';

import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import Users from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.get('/api/users/signup', (req, res) => {
  res.send('Hello');
});
// body('email') / Look for the property of email
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest, // Middleware to verify errors from express-validator
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Invalid credentials');
    }
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_TOKEN!
    );

    // Store it on session object
    req.session = { jwt: userJwt };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
