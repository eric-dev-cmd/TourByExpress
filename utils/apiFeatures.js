const Tour = require('../models/Tour')
class APIFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }
    filter() {
        /**
         * TODO: 1. Filtering
         */
        //  const queryObj = {
        //      ...req.query
        //  }
        const queryObj = {
            ...this.queryString
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
        // let query = Tour.find(JSON.parse(queryStr))
        this.query.find(JSON.parse(queryStr))
        // console.log("Trung Vinh: ", query)
        return this
    }
    sort() {
        /**
         * TODO: 2. Sorting
         */
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt');
        }

        // { duration: { gte: '7' }, page: '2' } -> i received
        // { difficulty: "easy", duration: {$gte: 5}} -> i need
        console.log("Trung vinh: ", this)
        return this
    }
    limitFields() {
        /**
         * TODO: 2. Field Limiting
         */
        if (this.queryString.fields) {
            const fieldsBy = this.queryString.fields.split(',').join(' ')
            console.log(fieldsBy)
            this.query = this.query.select(fieldsBy)
        } else {
            this.query = this.query.select('-__v')
        }
        return this
    }
    pagination() {
        /**
         * TODO: 4. Pagination
         */
        const page = parseInt(this.queryString.page) || 1
        const limit = parseInt(this.queryString.limit) || 100
        const skip = (page - 1) * limit
        // page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
        this.query = this.query.skip(skip).limit(limit)
        // if (this.queryString.page) {
        //     const numsTour = await Tour.countDocuments()
        //     if (skip >= numsTour) {
        //         throw new Error('This page does not exists')
        //     }
        // }
        return this
    }

}
module.exports = APIFeatures