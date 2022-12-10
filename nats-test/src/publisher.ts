import nats, { Stan } from 'node-nats-streaming';

const client = nats.connect('tickets', 'abc', {
  url: 'http://localhost:4222'
}); // Clled stan in the docume,tation

client.on('connect', () => {
  console.log('Publisher connected to NATS');
});
