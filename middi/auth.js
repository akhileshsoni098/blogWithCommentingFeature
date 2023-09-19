

const jwt = require("jsonwebtoken")



//==================== authentication ===============================


exports.authentication = function (req, res, next){
try{
    let token = req.headers["x-auth-token"]

if(!token) {return res.status(400).send({status:false , message:" TOKEN REQUIRED"})}

jwt.verify(token , process.env.JWT_SECRET_KEY, async function(err, decoded){

    if(err) {
    return res.status(401).send({status:false , message: err.message})
    }

else {
    req.user = decoded
    next()
}

})
}catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Failed to json OTP" });
  }
}



// ======================= adimin authorizartion ====================
exports.adminParamAuthorisation = async function (req, res, next) {
    
    try {

        const authorVerified = req.user._id;

        let blogID = req.params.blogId;

        if (Object.keys(req.params).length != 0) {

            if (!blogID) {
                return res.status(400).send({ status: false, msg: "Blog ID is Required !!" })
            }
            if (!isValidObjectId(blogID)) {

                return res.status(404).send({ status: false, msg: "Enter Vaild blogId.." });

            }
            const Id = await blogModel.findOne({ _id: blogID })
            if (!Id) {
                return res.status(404).send({ status: false, msg: "Entered wrong blogId .." });
            }
            let blogs = await blogModel.findById(blogID).select({ authorId: 1, _id: 0 });
            let authorId = blogs.authorId;
            if (authorId != authorVerified.toString()) {
                return res.status(403).send({ status: false, msg: "Author not authorised !!" });
            }
            next();

        } else {
            return res.status(400).send({ status: false, msg: "Please provide valid Information !!" });
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
