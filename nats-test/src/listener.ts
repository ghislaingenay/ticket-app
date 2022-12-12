import nats, { Message, Stan } from 'node-nats-streaming';
// @ts-ignore
import { randomBytes } from 'crypto';

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

abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return (
      this.client
        .subscriptionOptions()
        // setDeliverAllAvailable is needed even if setDurableName: add a new service online for the first time only => all events will be sent to new service
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subcription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subcription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  // How to parse a buffer data.toString('utf8')
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}

class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payments-service';
  onMessage(data: any, msg: Message) {
    // Any type of modification is done here. Add something to database for exple
    console.log('Event data!', data);
    msg.ack();
  }
}
