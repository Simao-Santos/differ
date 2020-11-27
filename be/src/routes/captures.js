const express = require('express');

const router = express.Router();

const captureController = require('../controllers/capture-controller');

router.get('/byPageId/:id', captureController.get_captures_by_page_id);
router.get('/', captureController.get_captures);
router.get('/:id', captureController.get_captures);
router.get('/:id/:id2', captureController.get_captures_range);
router.delete('/:id', captureController.delete_captures);

module.exports = router;
