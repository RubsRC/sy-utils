'use strict';

var express = require('express'),
  router = express.Router();

// ruta del post de inicio de sesión
router.post('/', function(req, res) {
  // TODO: validar que usuario y contraseña sean correctos
  if (req.body.user === 'admin' && req.body.password === 'pokeball') {
    res.render('dashboard');
  } else {
    res.render('index', { errMessage: 'Usuario y/o contraseña invalidos.' });
  }
});

// end point de una petición post, de prueba
router.post('/test', function (req, res) {
  res.render('dashboard');
  console.log(`Los params son: ${req.body.nombre} y ${req.body.apellido}.`);
});

module.exports = router;