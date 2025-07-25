const Joi = require('joi');

const createAnnouncement = Joi.object({
  title: Joi.string().required().max(100),
  content: Joi.string().required(),
  course: Joi.string().required(),
});

const updateAnnouncement = Joi.object({
  title: Joi.string().max(100),
  content: Joi.string(),
  course: Joi.string().required(),
}).min(1);

module.exports = {
  createAnnouncement,
  updateAnnouncement
};