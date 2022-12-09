import { app } from '../../_app';
import request from 'supertest';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate a fake correct id
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'poj', price: 45 })
    .expect(404);
});
it('returns a 401 if the user no authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate a fake correct id
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'poj', price: 45 })
    .expect(401);
});
it('returns a 401 if the user doesn/t own a ticket', async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); // Generate a fake correct id
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'poj', price: 45 });

  // By setting a cookie for a second time, equivalent to a second user
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'nznznkzfz',
      price: 1000
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  // Request as the same user
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'poj', price: 45 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 45 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'pouj', price: -10 })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'poj', price: 45 });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'dk', price: 23 })
    .expect(200);

  // Fetch the ticket and verify that the data was properly updated
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('dk');
  expect(ticketResponse.body.price).toEqual(23);
});
