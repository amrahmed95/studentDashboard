const asyncHandler = require('../utils/asyncHandler');
const announcementService = require('../services/announcement.service');
const HTTP_STATUS = require('../constants/httpStatus');
const MESSAGES = require('../constants/messages');

const createAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await announcementService.createAnnouncement(req.params.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
        status: true,
        message: MESSAGES.ANNOUNCEMENT.CREATED,
        data: announcement
    });
});

const getAnnouncements = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const announcements = await announcementService.getAnnouncements(userId);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        data: announcements
    });
});

const getAnnouncement = asyncHandler(async (req, res) => {
    const announcementId = req.params.id;
    const announcement = await announcementService.getAnnouncementById(announcementId);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        data: announcement
    });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
    const announcementId = req.params.id;
    const announcement = await announcementService.updateAnnouncement(announcementId, req.body);
    res.status(HTTP_STATUS.OK).json({
        status: true,
        message: MESSAGES.ANNOUNCEMENT.UPDATED,
        data: announcement
    });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcementId = req.params.id;
    await announcementService.deleteAnnouncement(announcementId);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.ANNOUNCEMENT.DELETED
    });
});

module.exports = {
    createAnnouncement,
    getAnnouncements,
    getAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
};