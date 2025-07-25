const asyncHandler = require('../utils/asyncHandler');
const quizService = require('../services/quiz.service');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const createQuiz = asyncHandler(async (req, res) => {
    const quiz = await quizService.createQuiz(req.params.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
        status: true,
        message: MESSAGES.QUIZ.CREATED,
        data: quiz
    });
});

const getQuizs = asyncHandler(async (req, res) => {

    const userId = req.params.id;
    const quizs = await quizService.getQuizs(userId);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        data: quizs
    });
});

const getQuiz = asyncHandler(async (req, res) => {
    const quizId = req.params.id;

    const quiz = await quizService.getQuizById(quizId);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        data: quiz
    });
});

const updateQuiz = asyncHandler(async (req, res) => {
    const quizId = req.params.id;
    const quiz = await quizService.updateQuiz(quizId, req.body);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        message: MESSAGES.QUIZ.UPDATED,
        data: quiz
    });
});

const deleteQuiz = asyncHandler(async (req, res) => {
    const quizId = req.params.id;
    await quizService.deleteQuiz(quizId);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.QUIZ.DELETED
    });
});

module.exports = {
    createQuiz,
    getQuizs,
    getQuiz,
    updateQuiz,
    deleteQuiz
};