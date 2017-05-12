'use-strict';
var express = require('express');
var bodyParser = require('body-parser');

// inicializamos el web server mediante express
var app = express();

// variables de configuración
var port = process.env.PORT || '3000';

// creamos un punto de acceso hacia la carpeta de los archivos públicos
app.use('/assets', express.static(__dirname + '/public'));
// definimos el template y la extensión que vamos a utilizar al renderear las paginas
app.set('view engine', 'ejs');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// metodo que se invoca cuando se visita el home page de la aplicación '/'
app.use('/', function(req, res, next) {
  console.log('Request url: ' + req.url);
  next();
});

// end point (route) del home page de la app, render busca el archivo index en la carpeta de views
app.get("/", function(req, res) {
  res.render('index');
});

// end point de una petición post, de prueba
app.post("/test", function(req, res) {
  res.render('resTest');
  console.log(req.body.nombre);
  console.log(req.body.apellido);
});

// indicamos en que puerto es servida la aplicación 
app.listen(port);