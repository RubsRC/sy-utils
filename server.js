'use strict';
var express = require('express'),
  bodyParser = require('body-parser'),
  // cors = require('cors'),
  morgan = require('morgan'),
  passport = require('passport'),
  flash = require('connect-flash'),
  session = require('express-session'),
  cookieParser = require('cookie-parser');

// Declare our express app and port
var app = express();
var port = process.env.PORT || '3000';

require('./config/passport')(passport); // passport configuration

// Set up Express application - Middleware
app.use(morgan('dev')); // logs every request to console
app.use(cookieParser()); // read cookies (needed fot auth)
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use('/assets', express.static(__dirname + '/public')); // set up public dir 
app.set('view engine', 'ejs'); // set up for ejs for templating
// app.use(cors()); // Cors middleware for Express connections

// required for passport
app.use(session({ secret: 'sqlthedogtheonlydog', resave: true, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes
require('./controllers/routes')(app, passport);

// launch the app!
app.listen(port);
console.log('The magic happened on port ' + port);