import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { app } from '../_app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
// Hooks that run before evry test
beforeAll(async () => {
  process.env.JWT_TOKEN = 'innscnioop57';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  return cookie;
};
