const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Get all workouts
router.get('/', workoutController.getWorkouts);

// Create a new workout
router.post('/', workoutController.createWorkout);

module.exports = router;
