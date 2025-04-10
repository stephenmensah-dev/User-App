const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.welcome = async (req, res) => {
  res.status(200).json({
    message: 'Welcome User',
  });
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Request Body:', req.body);

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    console.log('User created successfully:', newUser);

    res.status(201).json({
      message: 'User Created',
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Database Error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login Request Body:', req.body);

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Stored Hashed Password:', user.password);

    if (!user.password) {
      return res.status(500).json({
        message: 'Server Error',
        error: 'Password is missing in database',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User Not Found.' });
    }

    res.status(200).json({
      message: 'User Profile',
      profile: {
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      error: err.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        message: 'Access Denied, No Token',
      });
    }

    console.log('Logged Out');
    return res.status(200).json({
      message: 'Log Out Successful',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server Error',
      error: err.message,
    });
  }
};
