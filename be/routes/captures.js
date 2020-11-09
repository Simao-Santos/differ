var express = require('express');
var router = express.Router();

var capture_controller = require('../controllers/capture-controller');

router.get('/', capture_controller.get_captures);

module.exports = router;
