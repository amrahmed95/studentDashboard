// Async handler wrapper
// Defines a higher-order function `asyncHandler` that wraps an asynchronous
// function `fn` to handle errors. It ensures that if `fn` throws an error or
// returns a rejected promise, the error is caught and passed to the next
// function (typically an error handler)
// @param {function} fn - Asynchronous function to be wrapped
// @returns {function} - Wrapped function that handles errors
const asyncHandler = (fn) => {
  // Return a function that wraps the given fn
  return (req, res, next) => {
    // Resolve the result of calling fn with the given arguments
    // If the result is a rejected promise, it is caught here
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;