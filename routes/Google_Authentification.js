const express = require('express');
const passport = require('passport');

const router = express.Router();

// Google authentication route
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile'] })
    
  );
// Google authentication callback route
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Access the user data from the request object
      console.log(req.user);
      res.send('Authentication successful!'); // You can send a response to indicate successful authentication
    }
  );

  

module.exports = router;
