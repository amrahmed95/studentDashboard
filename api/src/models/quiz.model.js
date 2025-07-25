const mongoose = require("mongoose");
const Joi = require("joi");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: {
    type: String, required: true,
    required: true
  },
  topic: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  duration: { type: Number, required: true } // in minutes
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;