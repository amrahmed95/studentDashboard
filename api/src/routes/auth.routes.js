const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authValidation = require('../validations/auth.validation');
const validate = require('../middlewares/validate.middleware');

router.post('/signup', validate(authValidation.signUp), authController.signUp);
router.post('/signin', validate(authValidation.signIn), authController.signIn);

module.exports = router;