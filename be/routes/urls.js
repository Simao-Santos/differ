var express = require('express');
var router = express.Router();

var url_controller = require('../controllers/url-controller');

router.get('/', url_controller.get_urls);
router.post('/', url_controller.add_url);
router.delete('/', url_controller.delete_url);
router.post('/capture', url_controller.capture_url);
router.post('/compare', url_controller.compare_url);

module.exports = router;
