const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

// Get all videos
router.get('/', videoController.getVideos);

// Create a new video
router.post('/', videoController.createVideo);

// Create a new video with transcript
router.post('/create-with-transcript', videoController.createVideoWithTranscript);

// Create a new video with captions
router.post('/create-with-captions', videoController.createVideoWithCaptions);

module.exports = router;
