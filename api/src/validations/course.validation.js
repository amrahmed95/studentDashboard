const Joi = require('joi');

const createCourse = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  description: Joi.string().allow('')
});

const updateCourse = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  description: Joi.string().allow('')
}).min(1);

module.exports = {
  createCourse,
  updateCourse
};