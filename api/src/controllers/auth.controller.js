const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const signUp = asyncHandler(async (req, res) => {
  const user = await authService.signUp(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.AUTH.ACCOUNT_CREATED,
    data: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
       ...(user.role === 'student' && { enrolledCourses: user.enrolledCourses }),
       ...(user.role === 'moderator' && { assignedCourses: user.assignedCourses })
    }
  });
});

const signIn = asyncHandler(async (req, res) => {
  const result = await authService.signIn(req.body.email, req.body.password);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.AUTH.LOGIN_SUCCESS,
    data: result
  });
});

module.exports = {
  signUp,
  signIn
};