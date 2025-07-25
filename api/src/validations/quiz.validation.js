const Joi = require('joi');

const createQuiz = Joi.object({
  title: Joi.string().required(),
  course: Joi.string().required(),
  topic: Joi.string().required(),
  description: Joi.string().allow(''),
  dueDate: Joi.date().iso().greater('now'),
  duration: Joi.number().integer().min(1).required(),
});

const updateQuiz = Joi.object({
  title: Joi.string().required(),
  course: Joi.string().required(),
  topic: Joi.string().required(),
  description: Joi.string().allow(''),
  dueDate: Joi.date().iso().greater('now'),
  duration: Joi.number().integer().min(1).required(),
}).min(1);

module.exports = {
  createQuiz,
  updateQuiz
};