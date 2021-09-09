const Tour = require('../models/Tour')
exports.getAllTour = async (req, res) => {
    try {
        const tours = await Tour.find()
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
            message: "ERROR 😥"
        })
    }
}

exports.createTour = async (req, res) => {
    try {
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
            status: 'Success 🥰',
            message: 'ERROR 😥'
        })
    }
}
exports.updateTour = (req, res) => {

    res.status(200).json({
        status: "Success",
        data: {
            tour: "Updated tour here..."
        }
    })
}
exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: "Success",

    })
}