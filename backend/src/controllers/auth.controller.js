const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const User = require('../models/auth.model');
const generateToken = require('../lib/utils');
const cloudinary = require('../lib/cloudinary');

exports.signup = async (req, res, next) => {
    const { email, fullName, password } = req.body;
    try {
        if (password.length < 8) {
            return res.status(400).json({
                status: false,
                message: "Password must be above 8 letters"
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                status: false,
                message: "User already exists! Please login"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, fullName, password: hashedPassword });

        if (newUser) {
             generateToken(newUser._id,res);
             await newUser.save();
            return res.status(201).json({
                status: true,
                message: "New user created",
                newUser
            });
        } else {
            return res.status(400).json({
                status: false,
                message: "Invalid data"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
    }
};



exports.login = async(req , res , next)=>{
    const {email,password} = req.body;
    try {
          const user = await User.findOne({email})
    if(!user){
        res.status(404).json({
            status:false,
            message:"no user found with this email and password"
        })
    }
    const isMatched = await bcrypt.compare(password,user.password);
    if(!isMatched){
         res.status(401).json({
            status:false,
            message:"wrong password"
        })
    }

    generateToken(user._id,res)
    res.status(200).json({
        status:true,
        id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic : user.profilePic
    })
    
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
    }
  
}

exports.logout = async(req , res , next)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            status: true,
            message: "logged out successfully"
        });
    } catch (error) {
         res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
    }
}

exports.updateProfile = async(req,res)=>{
    try {
        const {profilePic}= req.body
        const userId = req.user._id
        if(!profilePic){
            return res.status(400).json({
                status:false,
                message:"profile pic is required"
            })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json({
            status:true,
            updatedUser
        })
    } catch (error) {
          res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
    }
}

exports.checkAuth = (req,res)=>{
try {
    res.status(200).json(req.user)
} catch (error) {
       res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
}
}