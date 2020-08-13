class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    //because of i am put message in super class no  need define in obj
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
