const express = require('express');

const router = express.Router();

const comparisonController = require('../controllers/comparison-controller');

router.get('/byPageId/:id', comparisonController.get_comparisons_by_page_id);
router.get('/', comparisonController.get_comparisons);
router.get('/:id', comparisonController.get_comparisons);
router.delete('/:id', comparisonController.delete_comparisons);

module.exports = router;
