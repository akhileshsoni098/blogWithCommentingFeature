const express = require("express")
const { getBlogsWithFilter, createBlog, updateBlog, deleteBlog, getSingleBlog } = require("../controllers/blogConroller")

const { createAdmin, logInAdmin } = require("../controllers/adminController")
const { authentication, adminAuthorisation } = require("../middi/auth")
const { createComment, updateComment, replyToComment, updateReply, deleteReply, deleteComment } = require("../controllers/commentController")

const router = express.Router()



/// auth /////


router.route("/register").post(createAdmin)

router.route("/logIn").post(logInAdmin)


///// create blog ///

router.route("/createBlog").post(authentication, createBlog )

// update in blog //

router.route("/updateBlog/:blogId").put(authentication,adminAuthorisation,updateBlog)

/// delete blog///

router.route("/deleteBlog/:blogId").put(authentication,adminAuthorisation,deleteBlog)


/// get all bolg and getblog by filter ////

router.route("/getBlogsWithFilter").get(getBlogsWithFilter)

// get particular blog ///

router.route("/getSingleBlog/:blogId").get(getSingleBlog)

////// comments ////

router.route("/createComment/:blogId").post(authentication,createComment)

router.route("/updateComment/:blogId/:commentId").put(authentication,updateComment )

// deleting comment with all the asosiated replies //

router.route("/deleteComment/:blogId/:commentId").delete(authentication,deleteComment )


//  replyComment ////
router.route("/createReplyToComment/:blogId/:commentId").post(authentication,replyToComment )

router.route("/updateReplyToComment/:blogId/:commentId/:replyId").put(authentication,updateReply )

router.route("/deleteReplyToComment/:blogId/:commentId/:replyId").delete(authentication,deleteReply )


module.exports = router