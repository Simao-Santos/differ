const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (resq, res, next) => {
  res.render('index', { title: 'Express' });
});

module.exports = router;
