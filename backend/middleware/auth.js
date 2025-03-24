// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and add user to request object
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database and add to request
      req.user = await User.findById(decoded.id).select('-passwordHash');
      
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to check if user has company role
const isCompany = (req, res, next) => {
  if (req.user && req.user.role === 'company') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, company access required' });
  }
};

// Middleware to check if user has researcher role
const isResearcher = (req, res, next) => {
  if (req.user && req.user.role === 'researcher') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized, researcher access required' });
  }
};

module.exports = { protect, isCompany, isResearcher };