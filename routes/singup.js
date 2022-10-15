const express = require('express')
const router = express.Router()
const User = require('../models/user')




router.get('/', async (req, res) => {
    res.render('signup')
})

router.post('/', async (req, res) => {

    let { name, email, password } = req.body
    
    
    try {
        
        if (await User.findOne({ email })) {
            res.status(400).render('signup', {errMessage: 'A user with this Email is already exist'})
        }
        const user = await new User({
            name,
            email,
            password
        })
        const newUser = await user.save()

       

        res.status(201).redirect('/login')

    } catch (e) {
        res.status(500).render('signup', {errMessage: 'there is a problem sign the user'})
    }
    
})

module.exports = router