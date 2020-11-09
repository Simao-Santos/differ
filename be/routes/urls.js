var express = require('express');
var router = express.Router();

var url_controller = require('../controllers/url-controller');

router.get('/', url_controller.get_urls);
router.post('/add', url_controller.add_url);
router.post('/delete', url_controller.delete_url);

module.exports = router;
