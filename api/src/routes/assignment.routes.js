const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignment.controller.js');
const assignmentValidation = require('../validations/assignment.validation');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// router.use(authMiddleware);

router.post('/', validate(assignmentValidation.createAssignment), assignmentController.createAssignment);
router.get('/', assignmentController.getAssignments);
router.get('/:id', assignmentController.getAssignment);
router.put('/:id', validate(assignmentValidation.updateAssignment), assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;