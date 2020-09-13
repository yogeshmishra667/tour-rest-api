const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

//FOR OVERVIEW/HOME PAGE
router.get(
  '/',
  bookingController.createBookingCheckout, //because after payment success redirect at home route
  authController.isLoggedIn,
  viewController.getOverview
);
//FOR TOUR PAGE
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
//FOR LOGIN USER
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
//FOR FOR REGISTER USER
router.get('/signup', authController.isLoggedIn, viewController.getSignupFrom);
//FOR ACCOUNT SETTINGS
router.get('/me', authController.protect, viewController.getAccount);
//FOR UPDATE USER ACCOUNT SETTINGS
router.patch('/updateMe', authController.protect, viewController.userUpdate);

module.exports = router;
