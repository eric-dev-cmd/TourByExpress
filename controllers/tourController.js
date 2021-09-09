// const fs = require('fs')
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(500).json({
            status: 'Failure 😥',
            message: 'Missing name or price 😥'
        })
    }
    next()
}

exports.checkID = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    // if (req.params.id * 1 > tours.length) {
    //     return res.status(400).json({
    //         status: 'Failure',
    //         message: 'Invalid Id 😥'
    //     })
    // }
    next()
}

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

exports.getCreateTour = (req, res) => {
    // console.log(req);

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