const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim : true,
    unique:true
  },
  fullName:{
    type:String,
    required:[true,'name must be given'],
    trim : true
  },
  password:{
    type:String,
    required:[true,'password must needed']
  },
  profilePic:{
    type:String,
    default:""
  }
},{
timestamps:true
})

const User = mongoose.model('User',userSchema)

module.exports = User;