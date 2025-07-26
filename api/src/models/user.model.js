const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['student', 'teacher']
  },
  // Role-specific fields (optional for each role)
  enrolledCourses: {   // For students
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Course',
    default: [],
    required: function() { return this.role === 'student'; }
  },
  assignedCourses: {   // For moderators
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Course',
    default: [],
    required: function() { return this.role === 'teacher'; }
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;