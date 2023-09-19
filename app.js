

const express =require("express")
const fileUpload = require('express-fileupload');
const cloudinary = require("cloudinary").v2;
const cors = require("cors")
const app = express()

app.use(fileUpload({
    useTempFiles:true
}))

app.use(express.json())


app.use(cors({
  origin: "http://localhost:3000",
}))


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  }); 

const user = require("./routes/userRoutes") 

const admin = require("./routes/adminRoutes") 

  app.use("/user",user)

  app.use("/admin", admin)
  
  module.exports = app