const database = require('../database');

// Get Comparisons
exports.get_comparisons = function getComparison(req, res, next) {
  let query;

  // Should we check username?
  if (req.params.id) {
    query = {
      text: 'SELECT id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date FROM comparison WHERE id=$1 AND deleted=$2 ORDER BY date DESC',
      values: [req.params.id, false],
    };
  } else {
    query = {
      text: 'SELECT id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date FROM comparison WHERE deleted=$1 ORDER BY date DESC',
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
        type: 'get_comparisons',
        comparisons: result.rows,
        msg: 'Operation successful',
      };

      res.send(json);
    }
  });
};

exports.get_comparisons_by_page_id = function getComparisonsByPageId(req, res, next) {
  let query;

  // Should we check username?
  if (req.params.id) {
    query = {
      text: 'SELECT id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date FROM comparison WHERE (capture_1_id IN (SELECT id FROM capture WHERE page_id=$1 AND deleted=$2) OR capture_2_id IN (SELECT id FROM capture WHERE page_id=$1 AND deleted=$2)) AND deleted=$2 ORDER BY date DESC',
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
          type: 'get_comparisons_by_page_id',
          comparisons: result.rows,
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

// Get Captures Range
exports.get_comparison_range = function getComparisonRange(req, res, next) {
  const query = {
    text: 'select capture.date, page.id , page.url, comparison.text_location as complocation from capture, page , comparison where capture.page_id = page.id and capture.deleted = $3 and (comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id)  and capture.id in (Select id from capture where page_id = page.id ORDER BY id DESC LIMIT 2)  and comparison.id in  ( select id from comparison where comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id order by id DESC LIMIT 1) ORDER BY page.id ASC LIMIT $2 offset $1',
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
        type: 'get_comparison_range',
        captures: result.rows,
        msg: 'Operation successful',
      };
      res.send(json);
    }
  });
};

exports.delete_comparisons = function deleteComparisons(req, res, next) {
  console.log('Deleting comparison...');

  if (req.params.id) {
    const query = {
      text: 'UPDATE comparison SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id',
      values: [true, req.params.id, false],
    };

    database.query(query, (err, result) => {
      if (err || result.rowCount === 0) {
        console.log(`Couldn't mark comparison with ID ${req.params.id} as deleted`);

        const json = {
          type: 'error',
          id: req.params.id,
          msg: 'Couldn\'t delete comparison',
        };

        res.send(json);
      } else {
        console.log(`Comparison with ID ${req.params.id} marked as deleted`);

        const json = {
          type: 'delete_comparison',
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
      msg: 'No specified comparison id',
    };

    res.send(json);
  }
};
