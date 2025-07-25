const db = require('../models');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');
const ApiError = require('../utils/apiError');

const Quiz = db.Quiz;

const createQuiz = async (userId, quizData) => {
    const quiz = await Quiz.create({
        ...quizData,
        userId
    });
    return quiz;
};

const getQuizs = async (userId) => {
    const quizzes = await Quiz.find({ userId }).sort({ dueDate: -1 });

    if (!quizzes || quizzes.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.QUIZ.NOT_FOUND);
    }

    return quizzes;
};

const getQuizById = async (quizId) => {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Quiz not found');
    }

    return quiz;
};

const updateQuiz = async (quizId, updateData) => {
    const updatedQuiz = await Quiz.findOneAndUpdate(
        { _id: quizId },
        { $set: updateData },
        { new: true }
    );

    if (!updatedQuiz) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.QUIZ.NOT_FOUND);
    }

    return updatedQuiz;
};

const deleteQuiz = async (quizId) => {
    const result = await Quiz.deleteOne({
        _id: quizId
    });

    if (result.deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.QUIZ.NOT_FOUND);
    }

    return { message: messages.QUIZ.DELETED };
};

module.exports = {
    createQuiz,
    getQuizs,
    getQuizById,
    updateQuiz,
    deleteQuiz
};