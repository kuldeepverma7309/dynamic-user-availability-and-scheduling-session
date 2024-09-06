const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT Token Generation
const generateToken = (id) => {
  console.log("jwt",process.env.JWT_SECRET)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// User Registration
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newuser = await User.create({ email, password, name });
    return res.status(201).json({
      user: {
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        role: newuser.role
      },
      token: generateToken(newuser._id)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const newuser = await User.findOne({ email });
    if (!newuser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Match passwords
    const isMatch = await newuser.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    return res.json({
      user: {
        _id: newuser._id,
        name: newuser.name,
        email: newuser.email,
        role: newuser.role
      },
      token: generateToken(newuser._id)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get Logged-in User Info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};


// User Logout
exports.logoutUser = (req, res) => {
  try {
    // On logout, return an empty user and a null token
    return res.status(200).json({
      user: {},
      token: null,
      message: 'Logout successful'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during logout' });
  }
};
