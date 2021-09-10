const Tour = require('../models/Tour')
exports.getAllTour = async (req, res) => {
    try {
        /**
         * TODO: FILTERING
         */
        const queryObj = {
            ...req.query
        }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        const query = Tour.find(queryObj)

        const tours = await query
        console.log(req.query)
        
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