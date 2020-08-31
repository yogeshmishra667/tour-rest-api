const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

//FOR OVERVIEW PAGE
router.get('/', viewController.getOverview);
//FOR TOUR PAGE
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
