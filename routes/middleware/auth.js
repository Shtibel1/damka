const jwt = require('jsonwebtoken');
const User = require('../../models/user')



async function auth(req, res, next) {
    const token = req.cookies.jwt
    if (!token) return res.redirect('/login')

    const decoded = await jwt.verify(token, 'asd')
    console.log(decoded);
    const user = await User.findOne({_id: decoded})

    if (user == []) {
        res.send('auth faild')
    }
    
    req.user = user
    req.token = token
    next()
}

module.exports = {
    auth
}