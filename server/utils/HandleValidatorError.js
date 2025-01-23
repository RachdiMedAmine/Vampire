const AppError = require('./app-Errors');

module.exports = err => {
  const { message } = err;
  return new AppError(message, 400);
};
