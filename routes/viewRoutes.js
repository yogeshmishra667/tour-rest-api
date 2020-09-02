const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

//FOR OVERVIEW PAGE
router.get('/', viewController.getOverview);
//FOR TOUR PAGE
router.get('/tour/:slug', viewController.getTour);
//FOR TOUR PAGE
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupFrom);

module.exports = router;
