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

// Get Comparisons Bundle Range
exports.get_comparison_range = function getComparisonRange(req, res, next) {
  if (req.params.offset && utils.isInteger(req.params.offset)
    && req.params.amount && utils.isInteger(req.params.amount)) {
    const query = {
      text: 'SELECT capture.date, comparison.id AS comp_id, page.id AS page_id, page.url, comparison.text_location AS comp_text_location, '
            + 'comparison.image_location AS comp_image_location, capture.image_location AS capt_image_location, comparison.diff_pixels * 1.0 / comparison.total_pixels as diff_percentage,'
            + 'comparison.capture_1_id as comp_capt_id_1 , comparison.capture_2_id as comp_capt_id_2 '
              + 'FROM capture, page, comparison '
              + 'WHERE capture.page_id = page.id AND capture.deleted = $3 AND page.deleted = $3'
                    + 'AND (comparison.capture_1_id = capture.id OR comparison.capture_2_id = capture.id) '
                    + 'AND capture.id IN (SELECT id FROM capture WHERE page_id = page.id ORDER BY id DESC LIMIT 2) '
                    + 'AND comparison.id IN (SELECT id '
                                          + 'FROM comparison '
                                          + 'WHERE comparison.capture_1_id = capture.id OR comparison.capture_2_id = capture.id '
                                          + 'ORDER BY id DESC LIMIT 1) '
              + 'ORDER BY diff_percentage DESC LIMIT $2 offset $1',
      values: [req.params.offset, req.params.amount, false],
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
