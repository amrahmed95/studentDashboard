const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const courseRoutes = require('./course.routes');
const quizRoutes = require('./quiz.routes');
const assignmentRoutes = require('./assignment.routes');
const announcementRoutes = require('./announcement.routes');

router.use('/auth', authRoutes);
router.use('/course', courseRoutes);
router.use('/quiz', quizRoutes);
router.use('/assignment', assignmentRoutes)
router.use('/announcement', announcementRoutes)

module.exports = router;

