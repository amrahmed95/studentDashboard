const Course = require('../models/course.model');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');
const ApiError = require('../utils/apiError');

const createCourse = async (courseData) => {
  if (await Course.findOne({ code: courseData.code })) {
    throw new ApiError(httpStatus.CONFLICT, messages.COURSE.CODE_EXISTS);
  }

  const course = await Course.create(courseData);
  return course;
};

const getCourses = async () => {
  const courses = await Course.find().sort({ createdAt: -1 });
  return courses;
};

const updateCourse = async (courseId, updateData) => {

  if (updateData.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, messages.COURSE.CODE_UPDATE_NOT_ALLOWED);
  }

  const course = await Course.findByIdAndUpdate(
    courseId,
    updateData,
    { new: true }
  );

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, messages.COURSE.NOT_FOUND);
  }

  return course;
};

const deleteCourse = async (courseId) => {
  const course = await Course.findByIdAndDelete(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, messages.COURSE.NOT_FOUND);
  }
  return course;
};

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse
};