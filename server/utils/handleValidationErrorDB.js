const AppError = require('./app-Errors');

module.exports = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400);
};
