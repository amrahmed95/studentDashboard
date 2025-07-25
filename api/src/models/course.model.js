const mongoose = require("mongoose");
const Joi = require("joi");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;