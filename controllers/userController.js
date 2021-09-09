const fs = require('fs')
const users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/users.json`))

exports.getAllUsers = (req, res) => {
    return res.status(500).json({
        status: "error",
        message: 'This is route is not defined 😥'
    })
}
exports.createUser = (req, res) => {
    return res.status(500).json({
        status: "error",
        message: 'This is route is not defined 😥'
    })
}
exports.getUser = (req, res) => {
    return res.status(500).json({
        status: "error",
        message: 'This is route is not defined 😥'
    })
}
exports.updateUser = (req, res) => {
    return res.status(500).json({
        status: "error",
        message: 'This is route is not defined 😥'
    })
}
exports.deleteUser = (req, res) => {
    return res.status(500).json({
        status: "error",
        message: 'This is route is not defined 😥'
    })
}