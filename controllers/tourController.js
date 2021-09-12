const Tour = require('../models/Tour')
const APIFeatures = require('../utils/apiFeatures')
exports.aliasTopTours = async (req, res, next) => {
    req.query.limit = '5',
        req.query.sort = '-ratingsAverage,price',
        req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}
exports.getAllTour = async (req, res) => {
    try {
        /**
         * TODO: 5. EXECUTE QUERY
         */
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination()
        const tours = await features.query


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
            requestAt: req.requestTime,
            result: tours.length,
            data: {
                tours
            }
        })
    } catch (error) {
        res.status(404).json({
            status: "Failure 😥",
            message: error
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        // const newTour = new Tour({})
        // newTour.save()
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'Success 🥰',
            data: {
                tour: newTour
            }
        })
    } catch (error) {
        res.status(400).json({
            status: 'Failure 😥',
            message: 'Invalid to data sent 😥'
        })
    }
}
exports.getTour = async (req, res) => {
    const id = req.params.id
    try {
        // const tour = await Tour.findById(id)
        const tour = await Tour.findOne({
            _id: req.params.id
        })

        res.status(200).json({
            status: 'Success 🥰',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure 🤔',
            message: 'ERROR 😥'
        })
    }
}
exports.updateTour = async (req, res) => {
    try {
        const id = req.params.id
        const tour = await Tour.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "Success",
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure 🥰',
            message: 'ERROR 😥'
        })
    }
}
exports.deleteTour = async (req, res) => {
    try {
        const id = req.params.id
        await Tour.findByIdAndDelete(id)
        res.status(204).json({
            status: "Delete Success 🤗",
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure 🤔',
            message: 'ERROR 😥'
        })
    }
}
exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([{
                $match: {
                    ratingsAverage: {
                        $gte: 4.5
                    }
                }
            },
            {
                $group: {
                    // _id: null,
                    // _id: "$difficulty",
                    _id: {
                        $toUpper: "$difficulty"
                    },

                    numTours: {
                        $sum: 1
                    },
                    numRatings: {
                        $sum: "$ratingsAverage"
                    },
                    avgRating: {
                        $avg: "$ratingsAverage"
                    },
                    avgPrice: {
                        $avg: "$price"
                    },
                    minPrice: {
                        $min: "$price"
                    },
                    maxPrice: {
                        $max: "$price"
                    }
                }
            }, {
                $sort: {
                    avgPrice: -1
                }
            }, {
                $match: {
                    _id: {
                        $ne: "EASY"
                    }
                }
            }
        ])
        res.status(200).json({
            status: 'Success 🥰',
            data: {
                stats
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'Failure 🤔',
            message: 'ERROR 😥'
        })
    }
}