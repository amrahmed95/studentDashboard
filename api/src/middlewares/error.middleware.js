const HTTP_STATUS  = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

/**
 * Converts a given error into an ApiError object if it is not already
 * an instance of ApiError.
 *
 * @function
 * @param {Error} err - Error object.
 * @param {IncomingMessage} req - Request object.
 * @param {ServerResponse} res - Response object.
 * @param {NextFunction} next - Next function.
 *
 * error converter middleware function in Express.js. It checks if the error is an instance of ApiError
 * If not, it creates a new ApiError object with a default status code and message,
 * and then passes the error to the next middleware function using next(error)
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * Error handler middleware function.
 *
 * @function
 * @param {Error} err - Error object.
 * @param {IncomingMessage} req - Request object.
 * @param {ServerResponse} res - Response object.
 * @param {NextFunction} next - Next function.
 *
 * error handling middleware function in Express.js.
 * It catches errors, logs them in development mode,
 * and returns a JSON response with the error status code, message, and stack trace (if in development mode)
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const { message } = err;

  if (process.env.NODE_ENV === 'development') {
     logger.error(`Error ${statusCode || 500}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  errorConverter,
  errorHandler
};