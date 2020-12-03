const database = require('../database');
const utils = require('../utils');

// Get Comparisons
exports.get_comparisons = function getComparison(req, res, next) {
  // Should we check username?
  if (req.params.id) {
    if (utils.isInteger(req.params.id)) {
      const query = {
        text: 'SELECT id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date FROM comparison WHERE id=$1 AND deleted=$2 ORDER BY date DESC',
        values: [req.params.id, false],
      };

      database.query(query, (err, result) => {
        if (err) {
          console.log(err);
          console.log('Couldn\'t get comparisons');
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
      text: 'SELECT id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date FROM comparison WHERE deleted=$1 ORDER BY date DESC',
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

// Get Comparisons by Page Id
exports.get_comparisons_by_page_id = function getComparisonsByPageId(req, res, next) {
  // Should we check username?
  if (req.params.id && utils.isInteger(req.params.id)) {
    const query = {
      text: 'SELECT id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date FROM comparison WHERE (capture_1_id IN (SELECT id FROM capture WHERE page_id=$1 AND deleted=$2) OR capture_2_id IN (SELECT id FROM capture WHERE page_id=$1 AND deleted=$2)) AND deleted=$2 ORDER BY date DESC',
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

// Get Captures Range
exports.get_comparison_range = function getComparisonRange(req, res, next) {
  const query = {
    text: 'select capture.date, page.id , page.url, comparison.text_location as complocation from capture, page , comparison where capture.page_id = page.id and capture.deleted = $3 and (comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id)  and capture.id in (Select id from capture where page_id = page.id ORDER BY id DESC LIMIT 2)  and comparison.id in  ( select id from comparison where comparison.capture_1_id = capture.id or comparison.capture_2_id = capture.id order by id DESC LIMIT 1) ORDER BY page.id ASC LIMIT $2 offset $1',
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
        type: 'get_comparison_range',
        captures: result.rows,
        msg: 'Operation successful',
      };
      res.send(json);
    }
  });
};

// Delete Comparisons
exports.delete_comparisons = function deleteComparisons(req, res, next) {
  console.log('Deleting comparison...');

  if (req.params.id && utils.isInteger(req.params.id)) {
    const query = {
      text: 'UPDATE comparison SET deleted=$1 WHERE id=$2 AND deleted=$3 RETURNING id, capture_1_id, capture_2_id, text_location, image_location, diff_pixels, total_pixels, date',
      values: [true, req.params.id, false],
    };

    database.query(query, (err, result) => {
      if (err) {
        console.log(`Couldn't mark comparison with ID ${req.params.id} as deleted`);
        res.sendStatus(500);
      } else if (result.rowCount === 0) {
        console.log(`Comparison with ID ${req.params.id} does not exist`);
        res.sendStatus(404);
      } else {
        console.log(`Comparison with ID ${req.params.id} marked as deleted`);
        res.status(200).send(result.rows[0]);
      }
    });
  } else {
    res.sendStatus(400);
  }
};
