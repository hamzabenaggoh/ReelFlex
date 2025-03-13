const Influencer = require('../models/influencer');
const { exec } = require('child_process');
const path = require('path');

// Get all influencers
const getInfluencers = async (req, res) => {
  try {
    const influencers = await Influencer.find();
    res.json(influencers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new influencer
const createInfluencer = async (req, res) => {
  const { name, channel } = req.body;

  const newInfluencer = new Influencer({
    name,
    channel,
    videos: []
  });

  try {
    const influencer = await newInfluencer.save();
    res.status(201).json(influencer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update influencer's videos using the monitoring script
const updateInfluencerVideos = async (req, res) => {
  const { channelIdentifier } = req.body;

  if (!channelIdentifier) {
    return res.status(400).json({ message: "Channel identifier is required" });
  }

  try {
    // Execute the Python script
    const scriptPath = path.join(__dirname, '..', 'scripts', 'monitor_influencer.py');
    exec(`python3 ${scriptPath} "${channelIdentifier}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return res.status(500).json({ message: "Error fetching videos", error: error.message });
      }

      try {
        // Parse the JSON output from the Python script
        const newVideos = JSON.parse(stdout);

        // Find or create the influencer
        let influencer = await Influencer.findOne({ channel: channelIdentifier });
        
        if (!influencer) {
          // If influencer doesn't exist, create new one
          influencer = new Influencer({
            name: channelIdentifier.replace('@', ''),
            channel: channelIdentifier,
            videos: []
          });
        }

        // Add new videos that don't already exist
        for (const video of newVideos) {
          const videoExists = influencer.videos.some(v => v.videoId === video.id);
          
          if (!videoExists) {
            influencer.videos.push({
              videoId: video.id,
              title: video.title,
              uploadTime: new Date(video.published_at)
            });
          }
        }

        // Save the updated influencer
        await influencer.save();

        res.json({
          message: "Videos updated successfully",
          newVideosCount: newVideos.length,
          influencer
        });
      } catch (parseError) {
        console.error("Error parsing Python script output:", parseError);
        res.status(500).json({ 
          message: "Error processing videos", 
          error: parseError.message,
          stdout,
          stderr 
        });
      }
    });
  } catch (err) {
    console.error("Error in updateInfluencerVideos:", err);
    res.status(500).json({ message: "Error updating influencer videos", error: err.message });
  }
};

module.exports = { 
  getInfluencers, 
  createInfluencer, 
  updateInfluencerVideos 
}; 