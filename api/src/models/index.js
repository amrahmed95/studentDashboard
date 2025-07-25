const user = require("./user.model");
const announcement = require("./announcement.model");
const assignment = require("./assignment.model");
const course = require("./course.model");
const quiz = require("./quiz.model");

const db = {
  User: user,
  Announcement: announcement,
  Assignment: assignment,
  Course: course,
  Quiz: quiz
};

module.exports = db;