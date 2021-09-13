const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name 😗'],
        unique: true
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
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
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
    slug: String
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

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {
        lower: true
    })
    next()
})
tourSchema.pre('save', function (next) {
    console.log("Will you save document...")
    next()
})
tourSchema.post('save', function (doc, next) {
    console.log(doc)
    next()
})
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour