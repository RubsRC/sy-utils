'use strict';

module.exports = function (app, passport) {

  /* Handle home page GET */
  app.get('/', function (req, res) {
    // Display the Login page with any flash message, if any
    res.render('index');
  });

  /* Handle login page GET. */
  app.get('/login', function (req, res) {
    // Display the Login page with any flash message, if any
    res.render('login', { message: req.flash('loginMessage') });
  });

  /* Handle login POST */
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }),
    function (req, res) {
      console.log('hello');
      if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
      } else {
        req.session.cookie.expires = false;
      }
      res.redirect('/');
    });

  // show the signup form
  app.get('/signup', function (req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  /* Handle Dashboard  */
  app.get('/dashboard', isLoggedIn, function (req, res) {
    res.render('dashboard', { user: req.user });
  });

  /* Handle Logout */
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}