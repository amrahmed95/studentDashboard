const asyncHandler = require('../utils/asyncHandler');
const assignmentService = require('../services/assignment.service');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const createAssignment = asyncHandler(async (req, res) => {
    const assignment = await assignmentService.createAssignment(req.params.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
        status: true,
        message: MESSAGES.ASSIGNMENT.CREATED,
        data: assignment
    });
});

const getAssignments = asyncHandler(async (req, res) => {

    const userId = req.params.id;
    const assignments = await assignmentService.getAssignments(userId);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        data: assignments
    });
});

const getAssignment = asyncHandler(async (req, res) => {
    const assignmentId = req.params.id;

    const assignment = await assignmentService.getAssignmentById(assignmentId);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        data: assignment
    });
});

const updateAssignment = asyncHandler(async (req, res) => {
    const assignmentId = req.params.id;
    const assignment = await assignmentService.updateAssignment(assignmentId, req.body);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        message: MESSAGES.ASSIGNMENT.UPDATED,
        data: assignment
    });
});

const deleteAssignment = asyncHandler(async (req, res) => {
    const assignmentId = req.params.id;
    await assignmentService.deleteAssignment(assignmentId);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.ASSIGNMENT.DELETED
    });
});

module.exports = {
    createAssignment,
    getAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment
};