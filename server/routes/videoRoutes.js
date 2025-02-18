const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Get all videos
router.get('/', videoController.getVideos);

// Create a new video
router.post('/', videoController.createVideo);

module.exports = router;
