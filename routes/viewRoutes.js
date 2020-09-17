const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
//const bookingController = require('../controllers/bookingController');

const router = express.Router();

//FOR ALERT
router.use(viewsController.alerts);

//FOR OVERVIEW/HOME PAGE
router.get('/', authController.isLoggedIn, viewController.getOverview);
//FOR TOUR PAGE
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour);
//FOR LOGIN USER
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
//FOR FOR REGISTER USER
router.get('/signup', authController.isLoggedIn, viewController.getSignupFrom);
//FOR ACCOUNT SETTINGS
router.get('/me', authController.protect, viewController.getAccount);
//FOR UPDATE USER ACCOUNT SETTINGS
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.updateUserData
);
//FOR MY-BOOKING SETTINGS
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
