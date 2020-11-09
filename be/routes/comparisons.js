var express = require('express');
var router = express.Router();

var comparison_controller = require('../controllers/comparison-controller');

router.get('/', comparison_controller.get_comparisons);

module.exports = router;
