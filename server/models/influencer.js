const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
//   influencerId: { //Mongo seems to handle this automatically
//     type: String,
//     required: true,
//     unique: true,
//   },
  homepage: {  // Youtube shorts home page
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
      // TODO: can add more properties here, like a description, views, etc.
    }
  ],
  uploadTime: {
    type: String, // String for now to keep the upload time simple (e.g., "10:00 AM", "Evenings")
    required: true,
  }
});

const Influencer = mongoose.model('Influencer', influencerSchema);

module.exports = Influencer;
