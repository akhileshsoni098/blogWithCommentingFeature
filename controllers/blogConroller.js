
//============================= Importing models author & blog ==============================================

const adminModel = require("../models/adminModel");


const blogModel = require("../models/blogModel");

////////////// clodinary to retrive files from cloud //////

const cloudinary= require("cloudinary").v2


//================================ To validate unique Object id ============================================

const { isValidObjectId } = require("mongoose");

//==================================== Post API blogs creation ===========================================

exports.createBlog = async function (req, res) {
    try {

        const adminId = req.user._id
        
        const blogData = req.body;
       
        if (Object.keys(blogData).length != 0) {
            if (!adminId || adminId == "") {
                return res.status(400).send({ status: false, msg: "Author id is mandatory" });
            }
            if (!isValidObjectId(adminId)) {
                return res.status(404).send({ status: false, msg: "Invalid author id" });
            }
            const validadminId = await adminModel.findById(adminId);
            if (!validadminId) {
                return res.status(404).send({ status: false, msg: "Author does not exist with this id" });
            }

            if (!blogData.title || blogData.title == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , title is required." });
            }
            blogData.title = blogData.title.trim();

            if (!blogData.body || blogData.body == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , body is required." });
            }
            blogData.body = blogData.body.trim();

            if (!blogData.category || blogData.category == "") {
                return res.status(400).send({ status: false, msg: "Invalid request , category is required." });
            }

            blogData.authorId = adminId

            if (req.files && req.files.imageUrl) {
               
            
              const file = req.files.imageUrl;
            
              const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "Blog_Image",
              });

              blogData.imageUrl ={
                  public_Id: result.public_id,
                  url: result.secure_url,
                }
            }

            const saveData = await blogModel.create(blogData);
            return res.status(201).send({ status: true, msg: saveData });
        } else {
            return res.status(400).send({ status: false, msg: "invalid request" });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


//============================== Get API to fetch the blog data ========================================================

