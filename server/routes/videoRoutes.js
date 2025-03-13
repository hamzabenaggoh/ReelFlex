const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/videoController');

// Get all videos
router.get('/', VideoController.getVideos);

// Get video transcript by ID
router.get('/:videoId/transcript', VideoController.getTranscript);

// Create a new video
router.post('/', VideoController.createVideo);

// Create a new video with transcript
router.post('/with-transcript', VideoController.createVideoWithTranscript);

// Create a new video with captions
router.post('/with-captions', VideoController.createVideoWithCaptions);

// Analyze video transcript
router.get('/:videoId/analyze', VideoController.analyzeTranscript);

module.exports = router;
