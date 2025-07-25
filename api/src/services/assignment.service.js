const db = require('../models');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');
const ApiError = require('../utils/apiError');

const ASSIGNMENT = db.Assignment;

const createAssignment = async (userId, assignmentData) => {
    const assignment = await ASSIGNMENT.create({
        ...assignmentData,
        userId
    });
    return assignment;
};

const getAssignments = async (userId) => {
    const assignments = await ASSIGNMENT.find({ userId }).sort({ dueDate: -1 });

    if (!assignments || assignments.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.ASSIGNMENT.NOT_FOUND);
    }

    return assignments;
};

const getAssignmentById = async (assignmentId) => {
    const assignment = await ASSIGNMENT.findById(assignmentId);
    if (!assignment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
    }

    return assignment;
};

const updateAssignment = async (assignmentId, updateData) => {
    const updatedAssignment = await ASSIGNMENT.findOneAndUpdate(
        { _id: assignmentId },
        { $set: updateData },
        { new: true }
    );

    if (!updatedAssignment) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.ASSIGNMENT.NOT_FOUND);
    }

    return updatedAssignment;
};

const deleteAssignment = async (assignmentId) => {
    const result = await ASSIGNMENT.deleteOne({
        _id: assignmentId
    });

    if (result.deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.ASSIGNMENT.NOT_FOUND);
    }

    return { message: messages.ASSIGNMENT.DELETED };
};

module.exports = {
    createAssignment,
    getAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
};