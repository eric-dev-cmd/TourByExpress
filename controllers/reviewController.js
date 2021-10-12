const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  return res.status(200).json({
    status: 'Success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReviews = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);
  return res.status(201).json({
    status: 'Created Success',
    data: {
      review: newReview,
    },
  });
});
