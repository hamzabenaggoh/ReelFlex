const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,  // duration in minutes
    required: true,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
