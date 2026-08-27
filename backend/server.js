const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware (Parse JSON requests and enable CORS)
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes); // Added Student API routes here

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Connected Successfully!');
  })
  .catch((err) => {
    console.error(' MongoDB Connection Error:', err);
  });

// Test Route (Check if server is running)
app.get('/', (req, res) => {
  res.send('Student Tracker Backend is Running!');
});

// Get Port from .env or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});