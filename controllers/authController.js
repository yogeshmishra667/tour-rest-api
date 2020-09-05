const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

//FOR JWT SIGN TOKEN(REUSE CODE)
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

//FOR SEND TOKEN FOR ALL ENDPOINT (REUSE CODE)
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  //SEND TOKEN BY COOKIE
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 //90 DAY
    ),
    // secure: true
    httpOnly: true,
    sameSite: 'Strict'
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

//FOR LOGIN USER
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
  createSendToken(user, 201, res);
});

//FOR PROTECT ROUTE
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log(token);
  } else if (req.cookies.jwt) {
    //FOR CLIENT SIDE AUTH VIA A COOKIE
    token = req.cookies.jwt;
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

//for user permission & authorization
exports.restrictTo = (...roles) => {
  //use closure because middleware () never take args
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

//for forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

//for reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  /* we again encrypt token because we want to compare token with send by user & also store in Db but user send plain text token & at db stored encrypted token so want to compare first encrypted user token and compare with DB token */

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now()
      //if user find || if user not expires
    }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); //when you wark with sensitive data always use save not like update

  // 3) Update changedPasswordAt property for the user [at userModel]
  // 4) Log the user in, send JWT
  createSendToken(user, 201, res);
});

//for change password for login user
exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get user from collection
  const { currentPassword, password, passwordConfirm } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  //user id come from protect endpoint bY GRANT ACCESS

  //2) check if POSTed current password is correct
  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if show update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save(); // User.findByIdAndUpdate will NOT work as intended!

  //3) If everything ok, send token to client
  createSendToken(user, 201, res);
});
