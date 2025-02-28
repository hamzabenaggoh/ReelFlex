const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
  preferredInfluencers: {
    type: [String],
    default: [],
  }
//   workoutGoals: {
//     type: String,
//     enum: ['Weight Loss', 'Muscle Gain', 'Maintain Weight'],
//     required: true,
//   },
//   preferredWorkoutType: {
//     type: String,
//     enum: ['Cardio', 'Strength Training', 'HIIT', 'Flexibility', 'Mixed'],
//     default: 'Mixed',
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
