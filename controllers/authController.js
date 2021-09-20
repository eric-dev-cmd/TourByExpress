const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appErrors');

const signToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  // const payload = {
  //   id: newUser._id,
  //   name: newUser.name,
  // };
  const token = signToken(newUser._id, newUser.name);
  res.status(201).json({
    status: 'Success 🥰',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1 Check email & password exists
  if (!email || !password) {
    return next(new AppError('Please provide email && password', 400));
  }
  // 2 Check if user exists && password correct
  const user = await User.findOne({ email }).select('+password');
  const correct = await user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id, user.name);
  // 3 If everything ok, send token to client
  res.status(200).json({
    status: 'Success',
    token,
    user,
  });
});
exports.protect = catchAsync(async (req, res, next) => {
  
  next();
});
