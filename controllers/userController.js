const fs = require('fs');
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);
const User = require('../models/User');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find({});

  return res.status(200).json({
    status: 'Success',
    requestAt: req.requestTime,
    result: users.length,
    data: {
      users,
    },
  });
});
exports.createUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This is route is not defined 😥',
  });
};
exports.getUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This is route is not defined 😥',
  });
};
exports.updateUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This is route is not defined 😥',
  });
};
exports.deleteUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This is route is not defined 😥',
  });
};
