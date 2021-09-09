const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'A tour must have a name 😗'],
        unique: true
    },
    price: {
        type: Number,
        require: [true, 'A tour must have a price 😗']
    },
    rating: {
        type: Number,
        default: 4.5
    },

}, {
    timestamps: true
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour