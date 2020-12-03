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

// Get Captures Range
exports.get_captures_range = function getCapturesRange(req, res, next) {
  const query = {
    text: 'select capture.date, comparison.id as compid,page.id ,page.id, page.url, capture.image_location , comparison.capture_1_id as comparisonID , comparison.capture_2_id as comparisonID2, comparison.image_location as complocation from capture, page , comparison where capture.page_id = page.id and capture.deleted = $3 and (comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id) and capture.id in (Select id from capture where page_id = page.id ORDER BY id DESC LIMIT 2) and comparison.id in ( select id from comparison where comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id order by id DESC LIMIT 1) ORDER BY page.id ASC LIMIT $2 offset $1',
    values: [req.params.id, req.params.offset, false],
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
        type: 'get_captures_range',
        captures: result.rows,
        msg: 'Operation successful',
      };
      res.send(json);
    }
  });
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
