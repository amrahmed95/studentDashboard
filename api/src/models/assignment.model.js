const mongoose = require("mongoose");
const Joi = require("joi");

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: String, required: true,
    required: true
  },
  topic: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  duration: { type: Number }
}, { timestamps: true });

const Assignment = mongoose.model("Assignment", AssignmentSchema);

module.exports = Assignment;