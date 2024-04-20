const User = require('../models/user')
const JWT  = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth = async (req,res,next) => {

    const authHeader = req.headers.authorization
    
    if(!authHeader || !authHeader.startsWith("Bearer "))
        throw new UnauthenticatedError('Authentecation Invalid 1')

    const token = authHeader.split(' ')[1]

    try 
    {
        const payload = JWT.verify(token,process.env.JWT_SECRET)
        req.user = {userId: payload.userId, name: payload.name}
        next()

    } 
    catch (error) 
    {
        throw new UnauthenticatedError('Authentecation Invlaid 2')
    }

}

module.exports = auth