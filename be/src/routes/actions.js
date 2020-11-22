const express = require('express');

const router = express.Router();

const actionsController = require('../controllers/actions-controller');

router.get('/capture/:id', actionsController.capture_url);
router.get('/compare/:id', actionsController.compare_url);

module.exports = router;
