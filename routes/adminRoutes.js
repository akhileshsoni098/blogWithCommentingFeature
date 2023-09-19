const express = require("express")
const { createAdmin, logInAdmin } = require("../controllers/adminController")
const { authentication } = require("../middi/auth")
const { createBlog } = require("../controllers/blogConroller")
const router = express.Router()




router.route("/register").post(createAdmin)

router.route("/logIn").post(logInAdmin)


///// create blog ///

router.route("/createBlog").post(authentication, createBlog )


module.exports = router