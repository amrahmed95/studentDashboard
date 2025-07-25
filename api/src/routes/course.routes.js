const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const courseValidation = require('../validations/course.validation');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

// router.use(authMiddleware);

router.post('/', validate(courseValidation.createCourse), courseController.createCourse);
router.get('/', courseController.getCourses);
router.put('/:id', validate(courseValidation.updateCourse), courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;


