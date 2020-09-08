const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

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

//FOR ACCOUT SETTINGS
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'your account'
  });
};

//FOR USER UPDATE PAGE
exports.userUpdate = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    { new: true, runValidators: true }
  );
  res.render('account', {
    title: 'update user',
    user: updatedUser
  });
});
