const Tour = require('../models/Tour');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const factory = require('./handlerFactory');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
exports.getAllTour = catchAsync(async (req, res) => {
  /**
   * TODO: 5. EXECUTE QUERY
   */
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  // const tours = await Tour.find({
  //     duration: 3,
  //     difficulty: "easy"
  // })

  // const tours = await Tour.find()
  //     .where('duration')
  //     .equals(5)
  //     .where('difficulty')
  //     .equals('easy')

  return res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.createTour = factory.createOne(Tour);
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  // const tour = await Tour.findOne({
  //     _id: req.params.id
  // })
  // console.log(tour);
  if (!tour) {
    console.log('No');
    return next(new AppError(`No tour found with that ID`, 404));
  }

  res.status(200).json({
    status: 'Success 🥰',
    data: {
      tour,
    },
  });
});
exports.updateTour = catchAsync(async (req, res) => {
  const id = req.params.id;
  const tour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError(`No tour found with that ID`, 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res) => {
//   const id = req.params.id;
//   const tour = await Tour.findByIdAndDelete(id);
//   if (!tour) {
//     return next(new AppError(`No tour found with that ID`, 404));
//   }

//   res.status(204).json({
//     status: 'Delete Success 🤗',
//     data: {
//       tour: null,
//     },
//   });
// });
exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        // _id: null,
        // _id: "$difficulty",
        _id: {
          $toUpper: '$difficulty',
        },

        numTours: {
          $sum: 1,
        },
        numRatings: {
          $sum: '$ratingsAverage',
        },
        avgRating: {
          $avg: '$ratingsAverage',
        },
        avgPrice: {
          $avg: '$price',
        },
        minPrice: {
          $min: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
    {
      $match: {
        _id: {
          $ne: 'EASY',
        },
      },
    },
  ]);
  res.status(200).json({
    status: 'Success 🥰',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates',
        },
        numTourStarts: {
          $sum: 1,
        },
        tours: {
          $push: '$name',
        },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
  ]);
  res.status(200).json({
    status: 'Success 🥰',
    data: {
      plan,
    },
  });
});
