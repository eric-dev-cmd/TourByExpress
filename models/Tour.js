const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name 😗'],
        unique: true,
        trim: true,
        maxLength: [true, "A tour name must have less or equal then 40 characters"],
        minLength: [true, "A tour name must have less or equal then 10 characters"]

    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficult is either: easy, medium, difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [1, 'Rating must be below 5.0']

    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price 😗']
    },
    priceDiscount: {
        type: Number,
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summery 😗']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description 😗']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a image cover 😗']
    },
    image: {
        type: [String],
        required: [true, 'A tour must have a image cover 😗']
    },
    startDates: [Date],
    slug: String,
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
}, {
    timestamps: true,
})
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})
// Document middleware: runs before .save() and .create() .insertMany
// pre chạy => xong thi post moi chay
// tourSchema.pre('save', function (next) {
//     this.slug = slugify(this.name, {
//         lower: true
//     })
//     next()
// })
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
    this.start = Date.now()

    console.log(`Query took: ${Date.now()- this.start} miliseconds`)
    // console.log(doc)
    next()
})
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: false
            }
        }
    })
    console.log(this.pipeline())
    next()
})
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour