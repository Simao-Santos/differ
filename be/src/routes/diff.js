const express = require('express');

const router = express.Router();

const diffcheckerController = require('../controllers/diffchecker-controller');

router.get('/', diffcheckerController.diffChecker);

module.exports = router;



