const request = require('supertest');
const app = require('../src/app');
const database = require('../src/database');

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
    const url = 'http://wttr.in/';
    const today = new Date();

    const { rows } = await database.query('INSERT INTO page (username, url) VALUES (default, $1) RETURNING id', [url]);
    await database.query('INSERT INTO capture (page_id, image_location, text_location, date) VALUES ($1, $2, $3, $4) RETURNING id',
      [rows[0].id, '/shots/test.png', '/shots/test.html', today]);

    const res = await request(app)
      .get('/captures').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id', 1);
  });

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

describe('/comparisons/ Route', () => {
  it('should get all comparisons (empty)', async () => {
    const res = await request(app)
      .get('/comparisons').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should get all comparisons (1 comparison))', async () => {
    const url = 'http://wttr.in/';
    const today1 = new Date();
    const today2 = new Date();

    const { rows: rowsPage } = await database.query('INSERT INTO page (username, url) VALUES (default, $1) RETURNING id', [url]);
    const { rows: rowsCapture1 } = await database.query('INSERT INTO capture (page_id, image_location, text_location, date) VALUES ($1, $2, $3, $4) RETURNING id',
      [rowsPage[0].id, '/shots/test.png', '/shots/test.html', today1]);
    const { rows: rowsCapture2 } = await database.query('INSERT INTO capture (page_id, image_location, text_location, date) VALUES ($1, $2, $3, $4) RETURNING id',
      [rowsPage[0].id, '/shots/test.png', '/shots/test.html', today2]);

    await database.query('INSERT INTO comparison (capture_1_id, capture_2_id, image_location, text_location, diff_pixels, total_pixels, date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [rowsCapture1[0].id, rowsCapture2[0].id, '/shots/test.png', '/shots/test.html', 100, 200, today2]);

    const res = await request(app)
      .get('/comparisons').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id', 1);
  });

  it('should get comparison', async () => {
    const res = await request(app)
      .get('/comparisons/1').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should fail to get comparison (invalid id)', async () => {
    const res = await request(app)
      .get('/comparisons/1foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to get comparison (non-existent id)', async () => {
    const res = await request(app)
      .get('/comparisons/2').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should get comparisons by page id', async () => {
    const res = await request(app)
      .get('/comparisons/byPageId/3').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id', 1);
  });

  it('should get comparisons by page id (empty)', async () => {
    const res = await request(app)
      .get('/comparisons/byPageId/1').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should fail to get comparisons by page id (invalid id)', async () => {
    const res = await request(app)
      .get('/comparisons/byPageId/2foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to delete comparison (invalid id)', async () => {
    const res = await request(app)
      .delete('/comparisons/2foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to delete comparison (non-existent id)', async () => {
    const res = await request(app)
      .delete('/comparisons/2').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should delete comparison', async () => {
    const res = await request(app)
      .delete('/comparisons/1').send();
    expect(res.statusCode).toEqual(200);
  });
});

describe('/actions/ Route', () => {
  // Status 200 responses are not tested because it would have to wait for the captures to be taken
  // That's not optimal, so until there's a way to do that, it will not be done

  it('should fail to capture url (invalid id)', async () => {
    const res = await request(app)
      .get('/actions/capture/1foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to capture url (non-existent id)', async () => {
    const res = await request(app)
      .get('/actions/capture/10').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should capture url', async () => {
    const url = 'http://wttr.in/';
    const { rows } = await database.query('INSERT INTO page (username, url) VALUES (default, $1) RETURNING id', [url]);

    const res = await request(app)
      .get(`/actions/capture/${rows[0].id}`).send();
    expect(res.statusCode).toEqual(200);
  });

  it('should fail to compare url (invalid id)', async () => {
    const res = await request(app)
      .get('/actions/compare/1foo').send();
    expect(res.statusCode).toEqual(400);
  });

  it('should fail to compare url (non-existent id)', async () => {
    const res = await request(app)
      .get('/actions/compare/10').send();
    expect(res.statusCode).toEqual(404);
  });

  it('should fail to compare url (no older capture)', async () => {
    const url = 'http://wttr.in/';
    const { rows } = await database.query('INSERT INTO page (username, url) VALUES (default, $1) RETURNING id', [url]);

    const res = await request(app)
      .get(`/actions/compare/${rows[0].id}`).send();
    expect(res.statusCode).toEqual(412);
  });
});
