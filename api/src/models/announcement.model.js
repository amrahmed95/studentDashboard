const mongoose = require("mongoose");
const Joi = require("joi");

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  course: {
    type: String, required: true,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Announcement = mongoose.model("Announcement", AnnouncementSchema);

module.exports = Announcement;