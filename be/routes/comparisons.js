var express = require('express');
var router = express.Router();

var comparison_controller = require('../controllers/comparison-controller');

router.get('/byPageId/:id', comparison_controller.get_comparisons_by_page_id);
router.get('/', comparison_controller.get_comparisons);
router.get('/:id', comparison_controller.get_comparisons);
router.delete('/:id', comparison_controller.delete_comparisons);

module.exports = router;
