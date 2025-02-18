const Video = require('../models/video');

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new video
const createVideo = async (req, res) => {
  const { title, transcript} = req.body;
  console.log(req.body); 

  const newVideo = new Video({
    title,
    transcript
  });

  try {
    const video = await newVideo.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getVideos, createVideo };
