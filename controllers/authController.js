const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  const payload = {
    id: newUser._id,
    name: newUser.name,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: 'Success 🥰',
    token,
    data: {
      user: newUser,
    },
  });
});
