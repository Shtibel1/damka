const User = require('../../models/user')


let test = {name:'test'}
let users = [test]


function addUser(req, res, next) {
    const index = users.findIndex(user => user.name === req.user.name)


    users.push(req.user)
    req.onlineUsers = users
    next()
}

function deleteUser(user) {
    const index = users.findIndex(u => u.name === user.name)
    users.splice(index, 1)
}

module.exports = {
    addUser,
    deleteUser
}