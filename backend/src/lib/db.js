require('dotenv').config()

const mongoose = require('mongoose')


const dbConnect = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
         console.log("database connected successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports=dbConnect;