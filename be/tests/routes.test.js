const request = require('supertest');
const app = require('../src/app');

describe('/urls/ Route', () => {
  it('should get all urls (empty)', async () => {
    const res = await request(app)
      .get('/urls').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should fail to add url (invalid url)', async () => {
    const res = await request(app)
      .post('/urls')
      .send({
        url: 'https'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should add url', async () => {
    const res = await request(app)
      .post('/urls')
      .send({
        url: 'https://www.google.com/',
        doNotCapture: true
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should get url', async () => {
    const res = await request(app)
      .get('/urls/1').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('url', 'https://www.google.com/');
  });

  it('should fail to get url (invalid id)', async () => {
    const res = await request(app)
      .get('/urls/1foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to get url (non-existent id)', async () => {
    const res = await request(app)
      .get('/urls/2').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should fail to delete url (invalid id)', async () => {
    const res = await request(app)
      .delete('/urls/2foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to delete url (non-existent id)', async () => {
    const res = await request(app)
      .delete('/urls/2').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should delete url', async () => {
    const res = await request(app)
      .delete('/urls/1').send();
    expect(res.statusCode).toEqual(200);
  });
});
