import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../_app';

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');

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

global.signin = () => {
  // Build a JWY payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_TOKEN!);
  // Build session object { jwt: MY_JWT}
  const session = { jwt: token };
  // Turn that session session into JSON
  const sessionJSON = JSON.stringify(session);
  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  // Return the final string
  return [`session=${base64}`];
};
