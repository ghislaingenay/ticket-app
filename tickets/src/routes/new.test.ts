import { app } from '../_app';
import request from 'supertest';

it('has a route handler listening /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if user signed in', async () => {
  const response = await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401  if user signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({});
  expect(response.status).not.toEqual(401);
});
it('return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '', price: 10 })
    .expect(400);
});

it('return an error if no title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ price: 10 })
    .expect(400);
});

it('return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '56', price: -10 })
    .expect(400);
});

it('return an error if no price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '56' })
    .expect(400);
});

it('proper data sent', async () => {
  // add in a check to make sure a ticket was saved
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '56', price: 10 })
    .expect(200);
});
