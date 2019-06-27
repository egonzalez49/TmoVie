const passport = require('passport');

module.exports = app => {
  //route handler to start auth sequence
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  //after successful code from google auth, send google code and run strategy callback
  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/board');
    }
  );

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter'),
    (req, res) => {
      res.redirect('/board');
    }
  );

  //testing route to show logged-in user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
