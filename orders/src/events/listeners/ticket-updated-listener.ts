import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@gg-tickets/common';
import { ORDERS_SERVICE } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = ORDERS_SERVICE;
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    console.log('Heyy');
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
