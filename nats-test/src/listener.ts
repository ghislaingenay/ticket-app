import nats, { Message } from 'node-nats-streaming';
// @ts-ignore
import { randomBytes } from 'crypto';

console.clear();
const client = nats.connect('tickets', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
}); // Clled stan in the docume,tation

client.on('connect', () => {
  console.log('Listener connected to NATS');

  const options = client.subscriptionOptions();
  const subscription = client.subscribe(
    'ticket:created',
    'listenerQueueGroup',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
      // getSequence: give the current event number
    }
    console.log('Message Received');
  });
});
