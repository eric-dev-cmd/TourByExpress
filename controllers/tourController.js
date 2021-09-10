const Tour = require('../models/Tour')
exports.getAllTour = async (req, res) => {
    try {
        /**
         * TODO: FILTERING
         */
        const queryObj = {
            ...req.query
        }
        const excludedFields = ['sort', 'page', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
        /**
         * TODO: ADVANCED FILTERING
         * 1. Copy req.query in a variable
         * 2. Exclude fields which dont need at find() method.('select', 'sort', etc)
         * 3. Create queryString and modify to mongoose can understands( in => $in, gt => $gte)
         * 4. Query with modified queryString
         * 5. and then with query Results, do select, sort, populate etc
         */
        // console.log(queryObj)
        // Object to JSON
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        let query = Tour.find(JSON.parse(queryStr))
        // console.log("Trung Vinh: ", query)
        /**
         * TODO: SORTING
         */
        // console.log(req.query)
        console.log("1: ", req.query)
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            console.log(sortBy)
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt');
        }

        // { duration: { gte: '7' }, page: '2' } -> i received
        // { difficulty: "easy", duration: {$gte: 5}} -> i need

        const tours = await query;


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