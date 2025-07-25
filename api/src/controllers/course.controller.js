const asyncHandler = require('../utils/asyncHandler');
const courseService = require('../services/course.service');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const createCourse = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  res.status(HTTP_STATUS.CREATED).json({
    status: true,
    message: MESSAGES.COURSE.CREATED,
    data: course
  });
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.getCourses();
  res.status(HTTP_STATUS.OK).json({
    status: true,
    data: courses
  });
});


const updateCourse = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.status(HTTP_STATUS.OK).json({
    status: true,
    message: MESSAGES.COURSE.UPDATED,
    data: course
  });
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  res.status(HTTP_STATUS.OK).json({
    status: true,
    message: MESSAGES.COURSE.DELETED
  });
});

module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse
};