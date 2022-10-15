const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    token: {
        type: String
    }
    
})




User.pre('save', async function (next) {
    console.log('before saving' + this.password);
    this.password = await bcrypt.hash(this.password, 8)
    console.log('new hashedpassword', this.password);
    next()
})

module.exports = mongoose.model('User', User)