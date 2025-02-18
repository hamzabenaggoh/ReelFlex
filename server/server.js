const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const workoutRoutes = require('./routes/workoutRoutes');
const videoRoutes = require('./routes/videoRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/videos', videoRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5045;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
