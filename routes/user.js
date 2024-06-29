const express = require('express')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router()
const User = require('../models/user.js')
const passport = require('passport')
const { saveRedirectUrl, isLoggedIn } = require('../middleware.js')

const multer = require('multer')
const { storage_profile } = require('../cloudeConfig.js')
const pic_upload = multer({ storage: storage_profile })

const userController = require('../controllers/user.js')

router.route('/signup')
  .get(userController.getSignupForm)
  .post(wrapAsync(userController.signup))

router.route('/login')
  .get(userController.getLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/users/login',
      failureFlash: true
    }),
    wrapAsync(userController.login))

router.get('/logout', userController.logout)

// routes/user.js
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login', failureFlash: true }),
  (req, res) => {
    req.flash("success", `Welcome ${req.user.username}`);
    res.redirect('/explore');
  }
);

// profile set karne
router.get('/setup-profile',
  isLoggedIn,
  userController.getProfileSetupForm
)

router.post('/setup-profile',
  isLoggedIn,
  pic_upload.single('post[image]'),
  wrapAsync(userController.setupProfile)
)

module.exports = router