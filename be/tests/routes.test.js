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
        url: 'https',
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should add url', async () => {
    const res = await request(app)
      .post('/urls')
      .send({
        url: 'https://www.google.com/',
        doNotCapture: true,
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

describe('/captures/ Route', () => {
  it('should get all captures (empty)', async () => {
    const res = await request(app)
      .get('/captures').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should get all captures (1 capture))', async () => {
    await request(app)
      .post('/urls')
      .send({
        url: 'http://wttr.in/',
      });

    // Need to do this timeout because it takes a while for the capture to be inserted
    // Is there a better way to do this?
    await new Promise((r) => setTimeout(r, 15000));

    const res = await request(app)
      .get('/captures').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id', 1);
  }, 20000);

  it('should get capture', async () => {
    const res = await request(app)
      .get('/captures/1').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should fail to get capture (invalid id)', async () => {
    const res = await request(app)
      .get('/captures/1foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to get capture (non-existent id)', async () => {
    const res = await request(app)
      .get('/captures/2').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should get captures by page id', async () => {
    const res = await request(app)
      .get('/captures/byPageId/2').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id', 1);
  });

  it('should get captures by page id (empty)', async () => {
    const res = await request(app)
      .get('/captures/byPageId/1').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should fail to get captures by page id (invalid id)', async () => {
    const res = await request(app)
      .get('/captures/byPageId/2foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to delete capture (invalid id)', async () => {
    const res = await request(app)
      .delete('/captures/2foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to delete capture (non-existent id)', async () => {
    const res = await request(app)
      .delete('/captures/2').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should delete capture', async () => {
    const res = await request(app)
      .delete('/captures/1').send();
    expect(res.statusCode).toEqual(200);
  });
});
