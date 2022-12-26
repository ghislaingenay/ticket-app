import Queue from 'bull';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

expirationQueue.process(
  async (job: any): Promise<void> => {
    console.log(
      'I want to publish an expiration:complete event for orderId',
      job.data.orderId
    );
  },
  { delay: 10000 }
);

export { expirationQueue };
