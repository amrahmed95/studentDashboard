const jwt = require('jsonwebtoken');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');
const ApiError = require('../utils/apiError');
const db = require('../models');

const User = db.User;

/**
 * Authentication middleware to verify the user.
 *
 * Checks if the request has the authorization header, and if so, verifies the
 * token using the JWT secret. If the token is valid, it fetches the user from
 * the database and assigns it to the request object. If the user is not found
 * or the token is invalid, it returns an unauthorized error.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_TOKEN));
    }
};

module.exports = authMiddleware;