const db = require('../models');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');
const ApiError = require('../utils/apiError');

const ANNOUNCEMENT = db.Announcement;

const createAnnouncement = async (userId, announcementData) => {
    const announcement = await ANNOUNCEMENT.create({
        ...announcementData,
        userId
    });
    return announcement;
};

const getAnnouncements = async (userId) => {

    const announcements = await ANNOUNCEMENT.find({ createdBy: userId })
                                          .sort({ createdAt: -1 });

    if (!announcements || announcements.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.ANNOUNCEMENT.NOT_FOUND);
    }

    return announcements;
};

const getAnnouncementById = async (announcementId) => {
    const announcement = await ANNOUNCEMENT.findById(announcementId);
    if (!announcement) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Announcement not found');
    }

    return announcement;
};

const updateAnnouncement = async (announcementId, updateData) => {
    const updatedAnnouncement = await ANNOUNCEMENT.findOneAndUpdate(
        { _id: announcementId },
        { $set: updateData },
        { new: true }
    );

    if (!updatedAnnouncement) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.ANNOUNCEMENT.NOT_FOUND);
    }

    return updatedAnnouncement;
};

const deleteAnnouncement = async (announcementId) => {
    const result = await ANNOUNCEMENT.deleteOne({
        _id: announcementId
    });

    if (result.deletedCount === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, messages.ANNOUNCEMENT.NOT_FOUND);
    }

    return { message: messages.ANNOUNCEMENT.DELETED };
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
};