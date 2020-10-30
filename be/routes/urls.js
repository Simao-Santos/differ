var express = require('express');
var router = express.Router();

var url_management = require('../controllers/url-management');

router.get('/', url_management.get_urls);
module.exports = router;
