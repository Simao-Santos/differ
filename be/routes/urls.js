var express = require('express');
var router = express.Router();

var url_management = require('../controllers/url-management');

router.get('/', url_management.get_urls);
router.post('/add', url_management.add_url);

module.exports = router;
