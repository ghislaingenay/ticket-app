import express, { Request, Response } from 'express';

import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@gg-tickets/common';

import { Ticket } from '../models/ticket';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // In set, we can pass an object that we want to update to
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    // ticket.set({ ...req.body, title: req.body.title, price: req.body.price });
    // await ticket.save();
    res.send(updatedTicket);
  }
);

export { router as updateTicketRouter };
