const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//for jwt sign token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

//for login user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  // use +password because in userModel hide password but using select () you can access any data from database if you can hide data simple use like +password 🔼

  if (!user || !(await user.correctPassword(password, user.password))) {
    //1-correctPassword is instance method it define in user model
    //2-we check password like this because if someone try to access your details then it confuse password wrong or email
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token
  });
});

//for protected route
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  //2)verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //1) jwt.verify is async () so it also accept callback() means when token verify then callback() called so for return promise we use promisify()
  //2) it return { userId: '5f38179f179fe11600ceef6c', iat: 1597553851, exp: 1605329851 }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  //if current user exist that mean no one try to changed token
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
