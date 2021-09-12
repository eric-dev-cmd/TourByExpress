const mongoose = require('mongoose')

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
    startDates: [Date]
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
tourSchema.pre('save', function () {
    console.log(this)
})
const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour