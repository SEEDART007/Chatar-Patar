require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express();

const authRouter = require('./routes/auth.route');
const messageRouter = require('./routes/message.route')
const dbConnect = require('./lib/db');

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth/",authRouter)
app.use("/api/message",messageRouter)



const port = process.env.PORT || 5000 
app.listen(port,async()=>{
    console.log(`app is listening on port ${port}`)
    await dbConnect()
})