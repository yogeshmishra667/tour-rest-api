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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //when anyone set wrong value
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    //if anyone enter duplicate value
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    //for validation
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
