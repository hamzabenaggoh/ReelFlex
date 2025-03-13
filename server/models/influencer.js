const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  videos: [
    {
      videoId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      uploadTime: {
        type: Date,
        required: true,
      },
      // TODO: can add more properties here, like a description, views, etc.
    }
  ],
});

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
