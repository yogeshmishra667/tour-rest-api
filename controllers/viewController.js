const Tour = require('../models/tourModel');

//FOR ROOT PAGE
exports.getRoot = (req, res, next) => {
  res.render('base', {
    user: 'yogesh mishra',
    tour: 'yogi-tours'
  });
};
//FOR OVERVIEW PAGE
exports.getOverview = async (req, res, next) => {
  const tours = await Tour.find();
  res.render('overview', {
    title: 'All tours',
    tours
  });
};
//FOR TOUR PAGE
exports.getTour = (req, res, next) => {
  res.render('tour', {
    title: 'the forest hiker'
  });
};
