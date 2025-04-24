const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// In-memory store for OTPs
let otpStore = {};

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
  };

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'safestreet3@gmail.com',
      pass: 'bavqstwykhhcnzyw', 
    },
  });

  const mailOptions = {
    from: 'SafeStreet <safestreet3@gmail.com>',
    to: email,
    subject: 'Your OTP for SafeStreet Password Reset',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ error: 'Failed to send OTP.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ message: 'OTP sent successfully.' });
    }
  });
};

//Verify OTP only (no password update here)
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ error: 'No OTP sent for this email.' });

  if (record.otp !== otp || Date.now() > record.expiresAt) {
    return res.status(400).json({ error: 'Invalid or expired OTP.' });
  }
  res.json({ message: 'OTP verified successfully.' });
};

//Reset Password (after OTP is verified)
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ error: 'OTP not verified or expired.' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Remove OTP after password reset
  delete otpStore[email];

  res.json({ message: 'Password reset successful.' });
};

//Signup
exports.signup = async (req, res) => {
  const { name, phone, email, password, role } = req.body;

  if (!name || !phone || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
