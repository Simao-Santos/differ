const database = require('../database');

// Get Captures
exports.get_captures = function getCaptures(req, res, next) {
  let query;

  // Should we check username?
  if (req.params.id) {
    query = {
      text: 'SELECT id, text_location, image_location, date FROM capture WHERE id=$1 AND deleted=$2',
      values: [req.params.id, false],
    };
  } else {
    query = {
      text: 'SELECT id, text_location, image_location, date FROM capture WHERE deleted=$1',
      values: [false],
    };
  }

  database.query(query, (err, result) => {
    if (err) {
      const json = {
        type: 'error',
        msg: 'Couldn\'t access database',
      };

      res.send(json);
    } else {
      const json = {
        type: 'get_captures',
        captures: result.rows,
        msg: 'Operation successful',
      };

      res.send(json);
    }
  });
};

// Get Captures Range
exports.get_captures_range = function getCapturesRange(req, res, next) {
  const query = {
    text: 'select capture.date, comparison.id as compid,page.id ,page.id, page.url, capture.image_location , comparison.capture_1_id as comparisonID , comparison.capture_2_id as comparisonID2, comparison.image_location as complocation from capture, page , comparison where capture.page_id = page.id and capture.deleted = $3 and (comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id) and capture.id in (Select id from capture where page_id = page.id ORDER BY id DESC LIMIT 2) and comparison.id in ( select id from comparison where comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id order by id DESC LIMIT 1) ORDER BY page.id ASC LIMIT $2 offset $1',
    values: [req.params.id, req.params.id2, false],
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

exports.get_captures_by_page_id = function getCapturesByPageId(req, res, next) {
  let query;

  // Should we check username?
  if (req.params.id) {
    query = {
      text: 'SELECT id, text_location, image_location, date FROM capture WHERE page_id=$1 AND deleted=$2',
      values: [req.params.id, false],
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
          type: 'get_captures_by_page_id',
          captures: result.rows,
          msg: 'Operation successful',
        };

        res.send(json);
      }
    });
  } else {
    const json = {
      type: 'error',
      msg: 'No specified page ID',
    };

    res.send(json);
  }
};

exports.delete_captures = function deleteCaptures(req, res, next) {
  console.log('Deleting capture...');

  if (req.params.id) {
    const query = {
      text: 'UPDATE capture SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id',
      values: [true, req.params.id, false],
    };

    database.query(query, (err, result) => {
      if (err || result.rowCount === 0) {
        console.log(`Couldn't mark capture with ID ${req.params.id} as deleted`);

        const json = {
          type: 'error',
          id: req.params.id,
          msg: 'Couldn\'t delete capture',
        };

        res.send(json);
      } else {
        console.log(`Capture with ID ${req.params.id} marked as deleted`);

        const json = {
          type: 'delete_capture',
          id: req.params.id,
          msg: 'Operation successful',
        };

        res.send(json);
      }
    });
  } else {
    const json = {
      type: 'error',
      id: -1,
      msg: 'No specified capture id',
    };

    res.send(json);
  }
};
