const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

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
  if (!tours) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  //console.log(tours);
  res.status(200).render('tour', {
    title: `${tours.name} Tour`,
    tours
  });
});
//FOR LOGIN PAGE
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};
//FOR signup PAGE
exports.getSignupFrom = catchAsync(async (req, res, next) => {
  res.render('signup', {
    title: 'sign up your account'
  });
});

//FOR ACCOUNT SETTINGS
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'your account'
  });
};

//DISPLAY BOOKING IN MY-BOOKING PAGE
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

//FOR USER UPDATE PAGE
exports.userUpdate = async (req, res, next) => {
  res.render('account', {
    title: 'update user'
  });
};
