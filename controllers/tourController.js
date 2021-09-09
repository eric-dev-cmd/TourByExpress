const fs = require('fs')
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

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
    if (req.params.id * 1 > tours.length) {
        return res.status(400).json({
            status: 'Failure',
            message: 'Invalid Id 😥'
        })
    }
    next()
}

exports.getAllTour = (req, res) => {
    console.log(req.requestTime);
    return res.status(200).json({
        status: 'Success',
        requestAt: req.requestTime,
        result: tours.length,
        data: {
            tours
        }
    })
}

exports.getCreateTour = (req, res) => {
    // console.log(req);
    const newId = tours[tours.length - 1].id + 1
    console.log(newId)
    const newTour = Object.assign({
        id: newId
    }, req.body);

    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        }
    );
    console.log(tours)
}
exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1
    const tour = tours.find(tour => tour.id === id)
    res.status(200).json({
        status: 'Success',
        data: {
            tour
        }
    })
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
        data: {
            tour: null
        }
    })
}