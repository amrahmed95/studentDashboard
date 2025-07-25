const Joi = require('joi');

const signUp = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required()
                .messages({
                    'string.alphanum': 'Username must only contain alphanumeric characters',
                    'any.required': 'Username is required'
                }),
    email: Joi.string().email().required().messages({
                'string.email': 'Please enter a valid email address',
                'any.required': 'Email is required'
            }),
    password: Joi.string().min(6).max(100).required()
        .pattern(new RegExp('^[a-zA-Z0-9]{6,100}$')),

    confirmPassword: Joi.ref('password'),
    role: Joi.string().valid('student', 'moderator', 'admin').required(),
    enrolledCourses: Joi.when('role', {
        is: 'student',
        then: Joi.array().items(Joi.string().pattern(/^[A-Z]{2,4}\d{3}$/)),
        otherwise: Joi.forbidden()
    }),
    assignedCourses: Joi.when('role', {
        is: 'moderator',
        then: Joi.array().items(Joi.string().pattern(/^[A-Z]{2,4}\d{3}$/)),
        otherwise: Joi.forbidden()
    })
});

const signIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
});

module.exports = {
    signUp,
    signIn,
};