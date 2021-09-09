const Tour = require('../models/Tour')
exports.getAllTour = (req, res) => {
    console.log(req.requestTime);
    return res.status(200).json({
        status: 'Success',
        requestAt: req.requestTime,
        // result: tours.length,
        // data: {
        //     tours
        // }
    })
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
exports.getTour = (req, res) => {

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