import nats from 'node-nats-streaming';
// @ts-ignore
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
const client = nats.connect('tickets', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
}); // Clled stan in the docume,tation

client.on('connect', () => {
  console.log('Listener connected to NATS');

  // Add force shutdown
  client.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(client).listen();
});

// When you try to close the client or disconnect from running server, verify if user restart server or close it
process.on('SIGINT', () => {
  client.close();
});
// SIG are signal sent to this process => intercept request on the program and close the program first and close the connection
process.on('SIGTERM', () => {
  client.close();
});
