import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';
  onMessage(data: any, msg: Message) {
    // Any type of modification is done here. Add something to database for exple
    console.log('Event data!', data);
    msg.ack();
  }
}
