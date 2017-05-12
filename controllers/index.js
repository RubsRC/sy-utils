'use strict';

var express = require('express'),
  router = express.Router();

// definir la ruta para el home page
router.get('/', function(req, res) {
  res.render('index', { errMessage: false });
});

module.exports = router;