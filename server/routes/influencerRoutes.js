const express = require('express');
const router = express.Router();
const InfluencerController = require('../controllers/influencerController');

// Get all influencers
router.get('/', InfluencerController.getInfluencers);

// Create a new influencer
router.post('/', InfluencerController.createInfluencer);

// Update influencer's videos
router.post('/update-videos', InfluencerController.updateInfluencerVideos);

module.exports = router; 