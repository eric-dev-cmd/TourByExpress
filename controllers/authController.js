const User = require('../models/User');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appErrors');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

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
  console.log(email, password);
  // 1 Check email & password exists
  if (!email || !password) {
    next(new AppError('Please provide email && password TTV', 400));
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
  let token;
  // 1) Getting token and check of it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access 😫', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('DECODED: ', decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  console.log('CURRENT', currentUser);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(`User recently changed password! Please login again`, 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // role ['admin', 'user', 'lead-guide']. role = user
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403)
      );
    }
    next();
  };
};
exports.forgotPassword = async (req, res, next) => {
  // 1. Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with email address`, 404));
  }
  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3. Send it's to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
};
exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id, user.name);
  res.status(200).json({
    status: 'Reset password success',
    token,
    user,
  });
};
