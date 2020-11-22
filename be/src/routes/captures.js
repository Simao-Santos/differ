var express = require('express');
var router = express.Router();

var capture_controller = require('../controllers/capture-controller');

router.get('/byPageId/:id', capture_controller.get_captures_by_page_id);
router.get('/', capture_controller.get_captures);
router.get('/:id', capture_controller.get_captures);
router.delete('/:id', capture_controller.delete_captures);

module.exports = router;
