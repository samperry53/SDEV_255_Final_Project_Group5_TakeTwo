const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();
// router.use(express.json());


router.get('/create', courseController.course_create_get);
router.get('/', courseController.course_index);
router.post('/', courseController.course_create_post);
router.get('/:id', courseController.course_details);
router.delete('/:id', courseController.course_delete);
router.get('/edit/:id', courseController.course_edit_get);
router.post('/edit/:id', courseController.course_edit_post);
router.get('/schedule', courseController.schedule_index);
// router.post('/courses/register/:courseId', courseController.schedule_create_post);
router.post('/courses/register/:courseId', courseController.schedule_create_post);


module.exports = router;