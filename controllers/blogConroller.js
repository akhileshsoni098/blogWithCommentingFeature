
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

exports.getBlogsWithFilter = async function (req, res) {
    try {
        let data = req.query;

        let blogs = await blogModel.find({ ...data }).populate("authorId");

        const formattedBlogs = blogs.map((blog) => {

            return {
                
                author: {
                    _id: blog.authorId._id,
                    fname: blog.authorId.fname,
                    lname: blog.authorId.lname,
                    email: blog.authorId.email,
                },
                blog_id: blog._id,
                title: blog.title,
                body: blog.body,
                imageUrl: blog.imageUrl,
                tags: blog.tags,
                category: blog.category,
                subcategory: blog.subcategory,
                comments: blog.comments,
                createdAt: blog.createdAt,
                updatedAt: blog.updatedAt,
            };
        });

        if (formattedBlogs.length === 0) {
            return res.status(404).send({ status: false, msg: "Data not found." });
        }

        return res.status(200).send({ status: true, data: formattedBlogs });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

exports.getSingleBlog = async(req,res)=>{
    try{

        const blogId = req.params.blogId

        let blog = await blogModel.findById(blogId ).populate("authorId");

        if(!blog){
            return res.status(404).send({status:false, message:"Blog data not found"})
        }
        const particularBlog = {
                
            author: {
                _id: blog.authorId._id,
                fname: blog.authorId.fname,
                lname: blog.authorId.lname,
                email: blog.authorId.email,
            },
            blog_id: blog._id,
            title: blog.title,
            body: blog.body,
            imageUrl: blog.imageUrl,
            tags: blog.tags,
            category: blog.category,
            subcategory: blog.subcategory,
            comments: blog.comments,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
        };

res.status(200).send({status:false , message:"single blog data", data:particularBlog})

    }catch(err){
        res.status(500).send({status:false , message:err.message})
    }
}




// ====================================== Put API Update the blog data =========================================================

exports.updateBlog = async function (req, res) {
    try {
        const data = req.body;
        const blogId = req.params.blogId;

        const currentBlog = await blogModel.findById(blogId);

        if (!currentBlog) {
            return res.status(404).send({ status: false, msg: "Blog not found." });
        }

       let result = null

        if (req.files && req.files.imageUrl) {
               
            
            const file = req.files.imageUrl;
          
             result = await cloudinary.uploader.upload(file.tempFilePath, {
              folder: "Blog_Image",
            });

          }

        const updateData = {
            title: data.title,
            body: data.body,
            tags: data.tags,
            subcategory: data.subcategory,
        };
console.log(result)
      
        if (result) {
            updateData.imageUrl = {
                public_Id: result.public_id,
                url: result.secure_url,
            };
        }

        const updatedBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            { $set: updateData },
            { new: true }
        );

        return res.status(200).send({ status: true, msg: "Blog updated successfully", data: updatedBlog });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ status: false, msg: err.message });
    }
};


// ======================================= Delete API delete data by blog Id ============================================================



exports.deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId;
        const checkBlogId = await blogModel.findById(blogId);
        if (!checkBlogId) {
            return res
                .status(404)
                .send({ status: false, msg: "Blog already deleted" });
        }
        const deleteBlog = await blogModel.findOneAndDelete(
            { _id: blogId },
            { new: true }
        );
        return res
            .status(200)
            .send({ status: true, msg: "Successfully Deleted" });


    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};








