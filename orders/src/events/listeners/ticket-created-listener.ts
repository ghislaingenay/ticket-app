import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@gg-tickets/common';
import { ORDERS_SERVICE } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = ORDERS_SERVICE;
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price } = data;
    const ticket = Ticket.build({ title, price });
    await ticket.save();

    msg.ack();
  }
}
