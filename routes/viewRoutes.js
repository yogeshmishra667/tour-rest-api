const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

//FOR ROOT PAGE
router.get('/', viewController.getRoot);
//FOR OVERVIEW PAGE
router.get('/overview', viewController.getOverview);
//FOR TOUR PAGE
router.get('/tour', viewController.getTour);

module.exports = router;
