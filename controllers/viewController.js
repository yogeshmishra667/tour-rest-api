const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

//FOR OVERVIEW PAGE
exports.getOverview = async (req, res, next) => {
  const tours = await Tour.find();
  res.render('overview', {
    title: 'All tours',
    tours
  });
};
//FOR TOUR PAGE
exports.getTour = catchAsync(async (req, res, next) => {
  const tours = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  //console.log(tours);
  res.render('tour', {
    title: 'tours',
    tours
  });
});
