const {User} = require('../model/user_schema');

const auth = (req, res, next) =>{
    const token = req.cookies._auth_
    
    User.findByToken(token, (err, user) =>{
        if(err) throw err

        if(!user) return res.json({
            error: true
        })

        req.user = user

        req.token = token
        next()
    })

}

module.exports = {auth}
