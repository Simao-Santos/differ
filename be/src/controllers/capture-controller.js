const database = require('../database');
const utils = require('../utils');

// Get Captures
exports.get_captures = function getCaptures(req, res, next) {
  // Should we check username?
  if (req.params.id) {
    if (utils.isInteger(req.params.id)) {
      const query = {
        text: 'SELECT id, text_location, image_location, date FROM capture WHERE id=$1 AND deleted=$2',
        values: [req.params.id, false],
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
      text: 'SELECT id, text_location, image_location, date FROM capture WHERE deleted=$1',
      values: [false],
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

// Get Pages Count
exports.get_count = function getCount(req, res, next) {
  const query = {
    text: 'select count(*) from page where deleted =$1',
    values: [false],
  };
  database.query(query, (err, result) => {
    if (err) {
      const json = {
        type: 'error',
        msg: 'Couldn\'t access database',
      };

      res.send(json);
    } else {
      const json = {
        type: 'get_count',
        captures: result.rows,
        msg: 'Operation successful',
      };
      res.send(json);
    }
  });
};

// Get Captures by Page Id
exports.get_captures_by_page_id = function getCapturesByPageId(req, res, next) {
  // Should we check username?
  if (req.params.id && utils.isInteger(req.params.id)) {
    const query = {
      text: 'SELECT id, text_location, image_location, date FROM capture WHERE page_id=$1 AND deleted=$2',
      values: [req.params.id, false],
    };

    database.query(query, (err, result) => {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).send(result.rows);
      }
    });
  } else {
    res.sendStatus(400);
  }
};

// Delete Capture
exports.delete_captures = function deleteCaptures(req, res, next) {
  console.log('Deleting capture...');

  if (req.params.id && utils.isInteger(req.params.id)) {
    const query = {
      text: 'UPDATE capture SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id, text_location, image_location, date',
      values: [true, req.params.id, false],
    };

    database.query(query, (err, result) => {
      if (err) {
        console.log(`Couldn't mark capture with ID ${req.params.id} as deleted`);
        res.sendStatus(500);
      } else if (result.rowCount === 0) {
        console.log(`Capture with ID ${req.params.id} does not exist`);
        res.sendStatus(404);
      } else {
        console.log(`Capture with ID ${req.params.id} marked as deleted`);
        res.status(200).send(result.rows[0]);
      }
    });
  } else {
    res.sendStatus(400);
  }
};
