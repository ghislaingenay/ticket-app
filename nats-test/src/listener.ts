import nats, { Message } from 'node-nats-streaming';
// @ts-ignore
import { randomBytes } from 'crypto';

console.clear();
const client = nats.connect('tickets', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
}); // Clled stan in the docume,tation

client.on('connect', () => {
  console.log('Listener connected to NATS');

  const options = client.subscriptionOptions().setManualAckMode(true);
  // Ack: Acknowledgement is true => Up to us to run some processing on the event (save data on db for example) and after akw the event
  // If not aknowledged, event will be send to queue after 30 seconds
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
    msg.ack();
  });
});
