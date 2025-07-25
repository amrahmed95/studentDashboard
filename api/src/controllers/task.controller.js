const asyncHandler = require('../utils/asyncHandler');
const taskService = require('../services/task.service');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
        status: true,
        message: MESSAGES.TASK.CREATED,
        data: task
    });
});

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getTasks(req.user.id);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        data: tasks
    });
});

const getTask = asyncHandler(async (req, res) => {
    // const task = await taskService.getTaskById(req.user.id, req.params.id);
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        data: task
    });
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        message: MESSAGES.TASK.UPDATED,
        data: task
    });
});

const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.user.id, req.params.id);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        message: MESSAGES.TASK.DELETED
    });
});

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};