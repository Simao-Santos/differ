var express = require('express');
var router = express.Router();

var url_controller = require('../controllers/url-controller');

router.get('/', url_controller.get_urls);
router.get('/:id', url_controller.get_urls);
router.post('/', url_controller.add_url);
router.delete('/:id', url_controller.delete_url);

module.exports = router;
