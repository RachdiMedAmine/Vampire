const AppError = require('./app-Errors');

module.exports = err => {
  const key = Object.keys(err.keyValue)[0];
  const value = err.errorResponse.errmsg
    .match(/(?:"[^"]*"|^[^"]*$)/)[0]
    .replace(/"/g, '');
  const message = `The ${key}: "${value}" already exists in the database`;
  return new AppError(message, 400);
};
