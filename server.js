'use strict';
var express = require('express'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  morgan = require('morgan');
var homePage = require('./controllers/index'),
  dashboard = require('./controllers/dashboard');

// nueva instancia de express
var app = express();

// variables de configuración
var port = process.env.PORT || '3000';

// Middleware
app.use('/assets', express.static(__dirname + '/public')); // punto de acceso hacia la carpeta de los archivos públicos
app.set('view engine', 'ejs'); // definimos el template y la extensión que vamos a utilizar al renderear las paginas
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(cors()); // Cors middleware for Express connections
app.use(morgan('dev')); // logger para desarrollo

// Routes
app.use('/', homePage);
app.use('/dashboard', dashboard);

// indicamos en que puerto es servida la aplicación 
app.listen(port);