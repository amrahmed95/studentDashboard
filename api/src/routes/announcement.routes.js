const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller.js');
const announcementValidation = require('../validations/announcement.validations.js');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// router.use(authMiddleware);

router.post('/', validate(announcementValidation.createAnnouncement), announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncement);
router.put('/:id', validate(announcementValidation.updateAnnouncement), announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;