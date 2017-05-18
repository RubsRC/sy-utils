'use strict';

var LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt-nodejs'),
  connection = require('./connection'),
  env = process.env.NODE_ENV || 'development',
  config = require('./config')[env];

connection.query('USE ' + config.database.dbName);

// expose this function to the app 
module.exports = function (passport) {

  // used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    connection.query('SELECT * FROM cat_usuarios WHERE id = ?;', [id], function (err, rows) {
      done(err, rows[0]);
    });
  });

  // LOCAL SIGNUP ============================================================
  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, username, password, done) {
      // we are checking to see if the user trying to login already exists
      connection.query('SELECT * FROM cat_usuarios WHERE username = ?', [username], function (err, rows) {
        if (err)
          return done(err);
        if (rows.length) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          // if there is no user with that username create the user
          var newUserMysql = {
            username: username,
            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
          };

          var insertQuery = 'INSERT INTO cat_usuarios ( username, password ) values (?,?)';
          connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function (err, rows) {
            newUserMysql.id = rows.insertId;
            return done(null, newUserMysql);
          });
        }
      });
    })
  );

  // LOCAL LOGIN =============================================================
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    // callback with email and password from the form
    function (req, username, password, done) {
      connection.query('SELECT * FROM cat_usuarios WHERE username = "' + username + '";', function (err, rows) {
        if (err) {
          return done(err);
        }
        if (!rows.length) {
          return done(null, false, req.flash('loginMessage', 'Usuario no valido.')); // req.flash is the way to set flashdata using connect-flash
        }
        // if the user is found but the password is wrong
        if (!bcrypt.compareSync(password, rows[0].password)) {
          return done(null, false, req.flash('loginMessage', 'Oops! Contraseña invalida.')); // create the loginMessage and save it to session as flashdata
        }
        // all is well, return successful user
        return done(null, rows[0]);
      });

    }));

};