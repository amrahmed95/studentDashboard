const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');
const apiError = require('../utils/apiError');

const User = db.User;
const Course = db.Course;

const signUp = async (userData) => {

  if (await User.findOne({ email: userData.email })) {
    throw new apiError(httpStatus.CONFLICT, messages.AUTH.EMAIL_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  let courseIds = [];
  if (userData.role === 'student' && userData.enrolledCourses) {
    courseIds = await convertCourseCodesToIds(userData.enrolledCourses);
  } else if (userData.role === 'moderator' && userData.assignedCourses) {
    courseIds = await convertCourseCodesToIds(userData.assignedCourses);
  }

  const user = await User.create({
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    role: userData.role,
    ...(userData.role === 'student' && { enrolledCourses: courseIds }),
    ...(userData.role === 'moderator' && { assignedCourses: courseIds })
  });

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};



const signIn = async (email, password) => {

    if(!email || !password) {
        throw new apiError(httpStatus.BAD_REQUEST, messages.AUTH.INVALID_CREDENTIALS);
    }

    let user = await User.findOne({ email }).select('+password');

    if(!user || !(await bcrypt.compare(password, user.password))) {
        throw new apiError(httpStatus.UNAUTHORIZED, messages.AUTH.INVALID_CREDENTIALS);
    }

    const populatePath = user.role === 'student' ? 'enrolledCourses' : 'assignedCourses';
    user = await User.findById(user._id)
        .populate({
        path: populatePath,
        select: '_id code name'
        });

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        ...(user.role === 'student' && { enrolledCourses: user.enrolledCourses }),
        ...(user.role === 'moderator' && { assignedCourses: user.assignedCourses }),
        token
    };
};



/**
 * Converts an array of course codes to an array of course IDs
 * @param {string[]} courseCodes - array of course codes
 * @returns {ObjectId[]} array of course IDs
 * @throws {ApiError} if any of the course codes are invalid
 */
const convertCourseCodesToIds = async (courseCodes) => {
const courses = await Course.find({ code: { $in: courseCodes } });

// Verify all courses were found
if (courses.length !== courseCodes.length) {
    const foundCodes = courses.map(c => c.code);
    const missingCodes = courseCodes.filter(code => !foundCodes.includes(code));
    throw new apiError(
    httpStatus.BAD_REQUEST,
    `Invalid course codes: ${missingCodes.join(', ')}`
    );
}

return courses.map(course => course._id);
};

module.exports = {
    signUp,
    signIn
};