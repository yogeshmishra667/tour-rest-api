const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

//IT'S AVAILABLE IN ALL VIEW PAGES
router.use(authController.isLoggedIn);
//FOR OVERVIEW/HOME PAGE
router.get('/', viewController.getOverview);
//FOR TOUR PAGE
router.get('/tour/:slug', viewController.getTour);
//FOR LOGIN USER
router.get('/login', viewController.getLoginForm);
//FOR FOR REGISTER USER
router.get('/signup', viewController.getSignupFrom);

module.exports = router;
