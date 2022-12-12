import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const client = nats.connect('tickets', 'abc', {
  url: 'http://localhost:4222'
}); // Clled stan in the docume,tation

client.on('connect', () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(client);
  publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  });

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20
  // });

  // client.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });
});
