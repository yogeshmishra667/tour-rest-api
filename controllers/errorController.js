const AppError = require('./../utils/appError');

//if anyone enter invalid value or id
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//if anyone enter duplicate value
const handleDuplicateFieldsDB = err => {
  //old way
  //const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  //console.log(err.keyValue.name);

  const message = `Duplicate field value: ${
    err.keyValue.name
  }. Please use another value!`;
  return new AppError(message, 400);
};

//for validation error
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//for wrong jwt token
const handleJWTErr = () =>
  new AppError('invalid token! please login again', 401);

//for when token is expired
const handleJWTExpireErr = () =>
  new AppError('your token has expired! please login again', 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message; //because message not show in production
    //when anyone set wrong value
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    //if anyone enter duplicate value
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    //for validation
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);
    //for wrong token
    if (error.name === 'JsonWebTokenError') error = handleJWTErr(error);
    //for when token is expired
    if (error.name === 'TokenExpiredError') error = handleJWTExpireErr(error);

    sendErrorProd(error, req, res);
  }
};
