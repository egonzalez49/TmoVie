const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

//grab user collection model
const User = mongoose.model('users');

//create token for user model instance from oauth flow below using mongo Id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//find user based on token when user calls api
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    //callback function after user acceps auth
    async (accessToken, refreshToken, profile, done) => {
      //find user in db with googleId matching profileId
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        //indicate adding user is done
        //pass in error (or null) and the user
        done(null, existingUser);
      } else {
        //create new user inside db
        const user = await new User({
          avatar: 'avatar.png',
          googleId: profile.id,
          dateCreated: Date.now()
        }).save();
        done(null, user);
      }
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      consumerKey: keys.twitterClientId,
      consumerSecret: keys.twitterClientSecret,
      callbackURL: '/auth/twitter/callback',
      proxy: true
    },
    async (token, tokenSecret, profile, done) => {
      const existingUser = await User.findOne({ twitterId: profile.id });
      if (existingUser) {
        //indicate adding user is done
        //pass in error (or null) and the user
        done(null, existingUser);
      } else {
        //create new user inside db
        const user = await new User({
          twitterId: profile.id,
          dateCreated: Date.now()
        }).save();
        done(null, user);
      }
    }
  )
);
