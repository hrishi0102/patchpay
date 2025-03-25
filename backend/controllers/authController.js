// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { encryptData } = require('../utils/encryption');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data and token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletId: user.walletId,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Failed to register user', error: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletId: user.walletId,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login', error: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

// @desc    Update Payman API key (for companies)
// @route   PUT /api/auth/update-api-key
// @access  Private/Company
const updatePaymanApiKey = async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey) {
      return res.status(400).json({ message: 'API key is required' });
    }
    
    // Encrypt API key
    const encryptedApiKey = encryptData(apiKey);
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { paymanApiKey: JSON.stringify(encryptedApiKey) },
      { new: true }
    ).select('-passwordHash');
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Payman API key updated successfully'
    });
  } catch (error) {
    console.error('Update API key error:', error);
    res.status(500).json({ message: 'Failed to update API key', error: error.message });
  }
};

// @desc    Get company's Payman balance
// @route   GET /api/auth/balance
// @access  Private/Company
const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.paymanApiKey) {
      return res.status(400).json({ message: 'Payman API key not set' });
    }
    
    // Import the functions needed to check balance
    const { createPaymanClient, getBalance } = require('../utils/paymanService');
    
    // Create Payman client with the company's API key
    const paymanClient = await createPaymanClient(user.paymanApiKey);
    
    // Get the balance (TSD = Test dollars)
    const balance = await getBalance(paymanClient, 'TSD');
    
    res.json({ balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Failed to get balance', error: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updatePaymanApiKey,
  getBalance
};