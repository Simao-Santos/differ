const database = require('../database');
const actionsController = require('./actions-controller');
const utils = require('../utils');

// Get URLs added by a specific user from the database
exports.get_urls = function getUrls(req, res, next) {
  let username = 'default';

  if (req.body.username) username = req.body.username;

  if (req.params.id) {
    if (utils.isInteger(req.params.id)) {
      const query = {
        text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2 AND id=$3',
        values: [username, false, req.params.id],
      };

      database.query(query, (err, result) => {
        if (err) {
          res.sendStatus(500);
        } else if (result.rowCount === 0) {
          res.sendStatus(404);
        } else {
          res.status(200).send(result.rows[0]);
        }
      });
    } else {
      res.sendStatus(400);
    }
  } else {
    const query = {
      text: 'SELECT id, url FROM page WHERE username=$1 AND deleted=$2',
      values: [username, false],
    };

    database.query(query, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).send(result.rows);
      }
    });
  }
};

// Add a new URL to the database
exports.add_url = function addUrl(req, res, next) {
  let username = 'default';

  if (req.body.username) username = req.body.username;

  console.log('Adding url...');

  // RegExp pattern to test URL validity
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3})|localhost)' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

  if (req.body.url && pattern.test(req.body.url)) {
    const queryInsert = {
      text: 'INSERT INTO page (username, url) VALUES ($1, $2) RETURNING id',
      values: [username, req.body.url],
    };

    console.log(`URL: ${req.body.url}`);

    database.query(queryInsert, (err, resultInsert) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).send(resultInsert.rows[0]);

        console.log(`URL saved with ID ${resultInsert.rows[0].id}`);

        if (!req.body.doNotCapture) actionsController.captureUrlSync(resultInsert.rows[0].id, null);
      }
    });
  } else {
    res.sendStatus(400);
  }
};

// Deletes urls from the database
exports.delete_url = function deleteUrl(req, res, next) {
  console.log('Deleting url...');

  if (req.params.id && utils.isInteger(req.params.id)) {
    const query = {
      text: 'UPDATE page SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id, url',
      values: [true, req.params.id, false],
    };

    database.query(query, (err, result) => {
      if (err) {
        console.log(`Couldn't mark page with ID ${req.params.id} as deleted`);
        res.sendStatus(500);
      } else if (result.rowCount === 0) {
        console.log(`Page with ID ${req.params.id} does not exist`);
        res.sendStatus(404);
      } else {
        console.log(`Page with ID ${req.params.id} marked as deleted`);
        res.status(200).send(result.rows[0]);
      }
    });
  } else {
    res.sendStatus(400);
  }
};

// Get Pages Count
exports.get_count = function getCount(req, res, next) {
  const query = {
    text: 'SELECT COUNT(*) FROM page WHERE deleted=$1',
    values: [false],
  };

  database.query(query, (err, result) => {
    if (err || !utils.isInteger(result.rows[0].count)) {
      res.sendStatus(500);
    } else {
      const count = parseInt(result.rows[0].count, 10);

      res.status(200).send({ count });
    }
  });
};
