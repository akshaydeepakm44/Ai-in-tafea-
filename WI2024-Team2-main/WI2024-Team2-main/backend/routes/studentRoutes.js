const express = require('express');
const { saveMarks, getAllStudents, moveStudent } = require('../controllers/studentController');

const router = express.Router();

router.post('/saveMarks', saveMarks);
router.get('/', getAllStudents);
router.put('/move/:id', moveStudent); // Add this route

module.exports = router;
