var express = require('express');
var router = express.Router();

var actions_controller = require('../controllers/actions-controller');

router.get('/capture/:id', actions_controller.capture_url);
router.get('/compare/:id', actions_controller.compare_url);

module.exports = router;
