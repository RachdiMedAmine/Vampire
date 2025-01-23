const handleCastErrorDB = require('./../utils/handleCastErrorDB');
const handleDuplicateErrorDB = require('./../utils/handleDuplicateErrorDB');
const handleValidationErrorDB = require('./../utils/handleValidationErrorDB');
const handleValidatiorErrorDB = require('./../utils/HandleValidatorError');
const AppError = require('./../utils/app-Errors');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: 'failed',
      message: 'Somgething went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'internal server error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    error.statusCode = err.statusCode;
    error.status = err.status;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidatorError') error = handleValidatiorErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = new AppError('Invalid token', 401);
    if (error.name === 'TokenExpiredError')
      error = new AppError('Expired token', 401);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendErrorProd(error, res);
  }
  next();
};
