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
  res.set('Content-Security-Policy', 'X-Content-Security-Policy');
  res.render('tour', {
    title: `${res.name}`,
    tours
  });
});
//FOR LOGIN PAGE
exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.render('login', {
    title: 'log in your account'
  });
});
//FOR signup PAGE
exports.getSignupFrom = catchAsync(async (req, res, next) => {
  res.render('signup', {
    title: 'sign up your account'
  });
});
