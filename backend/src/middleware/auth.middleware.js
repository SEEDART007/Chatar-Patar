require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/auth.model')
const protectRoute = async(req , res , next)=>{
try {
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({
            status:false,
            message:"unauthorize user!! no token provided"
        })
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select('-password')
    if(!user){
          return res.status(404).json({
            status:false,
            message:"user not found"
        })
    }
    req.user = user;
    next()
} catch (error) {
    res.status(500).json({
        status:false,
        message:error||"internal error"
    })
}
}

module.exports=protectRoute