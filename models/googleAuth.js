const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: '329439595652-i9nem31hldat1ipqle48brppcnftkuoc.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback', // Modify this URL based on your setup
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle the user profile or save it to a database
      console.log("hey",profile);
      done(null, profile);
    }
  )
);
// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
