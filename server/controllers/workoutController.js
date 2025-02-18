const Workout = require('../models/workout');

// Get all workouts
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new workout
const createWorkout = async (req, res) => {
  const { title, description, duration, level } = req.body;
  console.log(req.body); 

  const newWorkout = new Workout({
    title,
    description,
    duration,
    level,
  });

  try {
    const workout = await newWorkout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getWorkouts, createWorkout };
