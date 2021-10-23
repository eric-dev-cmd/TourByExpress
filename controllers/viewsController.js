const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/Tour');

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'Overview',
    tours,
  });
});
