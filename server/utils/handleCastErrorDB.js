const AppError = require('./app-Errors');

module.exports = err => {
  const message = `Invalid ${err.path} for value ${err.value}`;
  return new AppError(message, 400);
};
