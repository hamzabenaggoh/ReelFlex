const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    transcript: {
        type: String,
        required: true,
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
