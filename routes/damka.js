const express = require('express')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { auth } = require('./middleware/auth')
const { addUser } = require('./middleware/users')
const router = express.Router()




router.get('/', auth, (req, res) => {
    res.render('damka', {playerName: req.user.name})
})



module.exports = router