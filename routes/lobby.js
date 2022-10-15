const express = require('express')
const router = express.Router()
const { auth } = require('./middleware/auth')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { addUser } = require('./middleware/users')


router.get('/', auth, (req, res) => {
    console.log(req.onlineUsers); 
    res.render('lobby', {userName: req.user.name, onlineUsers: req.onlineUsers})
})

router.get('/profile', auth, (req, res) => {
    res.render('profile', {userName: req.user.name})
})

router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }).redirect('/login')
})


module.exports = router