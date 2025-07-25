const HTTP_STATUS = require('../constants/httpStatus');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

/**
 * Middleware for validating request bodies against a Joi schema.
 *
 * @param {Object} schema - Joi validation schema.
 * @returns {Function} - Middleware function.
 */
const validate = (schema) => (req, res, next) => {
  // Options for Joi validation
  const validationOptions = {
    abortEarly: false, // Return all errors, not just the first one
    allowUnknown: true, // Ignore unknown keys that are not defined in the schema
    stripUnknown: true  // Remove unknown keys from the validated object
  };

  // Validate the request body against the schema
  const { error, value } = schema.validate(req.body, validationOptions);

  if (error) {
    // Map and join validation error messages
    const errorMessage = error.details
      .map((details) => details.message.replace(/"/g, ''))
      .join(', ');

    // Log the validation error
    logger.error(`Validation error: ${errorMessage}`);

    // Pass an ApiError to the next middleware
    return next(new ApiError(HTTP_STATUS.BAD_REQUEST, `Validation error: ${errorMessage}`));
  }

  // Assign the validated value to the request body
  req.body = value;
  next();
};

module.exports = validate;