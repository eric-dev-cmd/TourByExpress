const mongoose = require('mongoose');
const slugify = require('slugify');
const Review = require('./Review');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name 😗'],
      unique: true,
      trim: true,
      maxLength: [
        100,
        'A tour name must have less or equal then 40 characters',
      ],
      minLength: [6, 'A tour name must have less or equal then 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price 😗'],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        return val < this.price;
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summery 😗'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description 😗'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a image cover 😗'],
    },
    image: {
      type: [String],
      required: [true, 'A tour must have a image 😗'],
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
  {
    timestamps: true,
  }
);
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document middleware: runs before .save() and .create() .insertMany
// pre chạy => xong thi post moi chay
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
// tourSchema.pre('save', function (next) {
//     console.log("Will you save document...")
//     next()
// })
// tourSchema.post('save', function (doc, next) {
//     console.log(doc)
//     next()
// })
// tourSchema.pre(/^find/, function (next) {
//     this.find({
//         secretTour: {
//             $ne: false
//         }
//     })
//     this.start = Date.now()
//     next()
// })
tourSchema.post(/^find/, function (doc, next) {
  this.start = Date.now();

  console.log(`Query took: ${Date.now() - this.start} miliseconds`);
  // console.log(doc)
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: false,
      },
    },
  });
  console.log(this.pipeline());
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
