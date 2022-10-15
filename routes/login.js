const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.get('/', (req, res) => {

    if (req.cookies.jwt) {
        return res.redirect('/')
    }
    res.render('login')
})


router.post('/', async (req, res) => {



    try {

        

        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.render('login', { errMessage: 'אימייל או סיסמא שגויים' })
        }

        if (!await bcrypt.compare(req.body.password, user.password)) {
            return res.render('login', { errMessage: 'סיסמא שגוייה' })
        }
        
        const token = await jwt.sign(user._id.toString(), 'asd')
        user.token = token;
        res.cookie('jwt', token, { httpOnly: true })
        res.redirect('/')

    } catch(e) {
        console.log(e);
        res.status(500).redirect('login')

    }
})


module.exports = router