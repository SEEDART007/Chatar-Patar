const  cloudinary = require("../lib/cloudinary")
const User = require("../models/auth.model")
const Message = require("../models/message.model")

exports.getUsersForSidebar = async(req , res )=>{
    try {
        const loggedInUserId = req.user._id
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filteredUser)
    } catch (error) {
        res.status(500).json({
            status:false,
            message:error||"internal server error"
        })
    }
}

exports.getMessages = async(req , res)=>{
    try {
        const {id:userToChatId} = req.params
        const senderId = req.user._id
        const message = await Message.find({
            $or:[
                {senderId:senderId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:senderId}
            ]
        })
        res.status(200).json(message)
    } catch (error) {
           res.status(500).json({
            status:false,
            message:error||"internal server error"
        })
    }
}

exports.sendMessage = async(req , res)=>{
    try {
        const {text,image}= req.body
        const{id:receiverId} = req.params
        const senderId = req.user._id
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const message = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await message.save()

        res.status(201).json(message)
    } catch (error) {
           res.status(500).json({
            status:false,
            message:error||"internal server error"
        })
    }
}