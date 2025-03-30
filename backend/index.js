// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const connectDB = require('./db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const bugRoutes = require('./routes/bugRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const notificationRoutes = require('./routes/notificationroutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const githubRoutes = require('./routes/githubRoutes');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bug Bounty Platform API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/github', githubRoutes);
// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bug Bounty Platform API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});