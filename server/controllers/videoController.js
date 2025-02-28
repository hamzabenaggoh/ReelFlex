const Video = require('../models/video');
const { exec } = require('child_process');

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
  const { videoId, title, transcript} = req.body;
  console.log(req.body); 

  const newVideo = new Video({
    videoId,
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

// Create a new video with transcript
const createVideoWithTranscript = async (req, res) => {
    const { videoId, title } = req.body;

    try {
        // Step 1: Call the Python script using the child_process module
        exec(`python3 scripts/getTranscript.py ${videoId}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return res.status(500).json({ message: "Error fetching transcript", error: error.message });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ message: "Error fetching transcript", error: stderr });
            }

            // Step 2: Use the entire transcript as a string (stdout)
            const transcriptText = stdout.trim(); // Remove any unnecessary whitespace

            // Step 3: Save the video and transcript to the database
            const newVideo = new Video({
                videoId,
                title,
                transcript: transcriptText // Store the whole transcript as a string
            });

            const video = await newVideo.save();
            res.status(201).json(video);  // Respond with the saved video data
        });
    } catch (err) {
        console.error("Error in createVideoWithTranscript:", err);
        res.status(500).json({ message: "Error fetching or saving transcript", error: err.message });
    }
};

// Create a new video with extracted captions
const createVideoWithCaptions = async (req, res) => {
    const { videoId, title } = req.body;

    try {
        // Step 1: Call the Python script using the child_process module
        exec(`python3 scripts/extract_raw_captions.py ${videoId}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                return res.status(500).json({ message: "Error fetching captions", error: error.message });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ message: "Error fetching captions", error: stderr });
            }

            // Step 2: Use the entire captions as a string (stdout)
            const captionsText = stdout.trim(); // Remove any unnecessary whitespace

            // Step 3: Save the video and captions to the database
            const newVideo = new Video({
                videoId,
                title,
                transcript: captionsText // Store the whole captions as a string
            });

            const video = await newVideo.save();
            res.status(201).json(video);  // Respond with the saved video data
        });
    } catch (err) {
        console.error("Error in createVideoWithCaptions:", err);
        res.status(500).json({ message: "Error fetching or saving captions", error: err.message });
    }
};

module.exports = { getVideos, createVideo, createVideoWithTranscript, createVideoWithCaptions };
