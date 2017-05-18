'use strict';
var express = require('express'),
  bodyParser = require('body-parser'),
  // cors = require('cors'),
  morgan = require('morgan'),
  passport = require('passport'),
  flash = require('connect-flash'),
  session = require('express-session'),
  cookieParser = require('cookie-parser');

// Set up our express app 
var app = express();
// Config values
var env = process.env.NODE_ENV || 'development',
  config = require('./config/config')[env],
  port = config.server.port,
  hostname = config.server.host;
// MySQL connection
var dbPool = require('./config/connection');

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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('notFound');
  next();
});

// launch the app!
app.listen(port, hostname, function () {
  dbPool.getConnection(function (err, connection) {
    if (err) {
      console.error('Problems connecting to MySQL.');
      console.error(err);
      return;
    }
    console.log(`Server is runnig at http://${hostname}:${port}`);
    console.log(`Connected to MySQL as id ${connection.threadId}.`);
    connection.release();
  });
});