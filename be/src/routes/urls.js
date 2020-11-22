const express = require('express');

const router = express.Router();

const urlController = require('../controllers/url-controller');

router.get('/', urlController.get_urls);
router.get('/:id', urlController.get_urls);
router.post('/', urlController.add_url);
router.delete('/:id', urlController.delete_url);

module.exports = router;
