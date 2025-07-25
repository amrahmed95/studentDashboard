const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const quizValidation = require('../validations/quiz.validation');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// router.use(authMiddleware);

router.post('/', validate(quizValidation.createQuiz), quizController.createQuiz);
router.get('/', quizController.getQuizs);
router.get('/:id', quizController.getQuiz);
router.put('/:id', validate(quizValidation.updateQuiz), quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;