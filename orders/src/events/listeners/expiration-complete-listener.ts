import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects
} from '@gg-tickets/common';
import { ORDERS_SERVICE } from './queue-group-name';
import { Order } from '../../models/order';
import { Message } from 'node-nats-streaming';
import { OrderCancelledPublisher } from '../publishers/order-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = ORDERS_SERVICE;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    // if the order is cancelled, this is not considered as reserved anymore
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id
      }
    });

    msg.ack();
  }
}
