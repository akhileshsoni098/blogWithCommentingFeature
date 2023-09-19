const adminModel = require("../models/adminModel");

const blogModel = require("../models/blogModel");

///////////// user can create his comment ////////////////////

exports.createComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = req.body;
        const { commentText } = data;
        const blogId = req.params.blogId;


        const user = await adminModel.findById(userId);

        if (!user) {
            return res.status(404).send({ status: false, message: "User not found." });
        }


        const fullName = `${user.fname} ${user.lname}`;


        const comment = {
            userId: userId,
            fullName: fullName,
            commentText: commentText,
        };


        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found." });
        }


        blog.comments.push(comment);


        await blog.save();

        return res.status(201).send({ status: true, message: "Comment created successfully", data: comment });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

/////////////// user can update his comment ////////////////

exports.updateComment = async (req, res) => {
    try {
        const userId = req.user._id;

        const data = req.body;
        const { commentText } = data;
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;

        const blog = await blogModel.findById(blogId);

        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found." });
        }

        const comment = blog.comments.id(commentId);

        if (!comment) {
            return res.status(404).send({ status: false, message: "Comment not found." });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).send({ status: false, message: "Permission denied." });
        }


        comment.commentText = commentText;


        await blog.save();

        return res.status(200).send({ status: true, message: "Comment updated successfully", data: comment });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

/////// user can give reply of the comment ///////////////

exports.replyToComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = req.body;
        const { replyText } = data;
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;

        if (!replyText) {
            return res.status(400).send({ status: false, message: "reply comment field is missing" })
        }

        const user = await adminModel.findById(userId);
        if (!user) {
            return res.status(404).send({ status: false, message: "User not found." });
        }

        const fullName = `${user.fname} ${user.lname}`;


        const reply = {
            userId: userId,
            fullName: fullName,
            replyText: replyText,
        };


        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found." });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).send({ status: false, message: "Comment not found." });
        }

        comment.replies.push(reply);


        await blog.save();

        return res.status(201).send({ status: true, message: "Reply created successfully", data: reply });
    } catch (err) {


        res.status(500).send({ status: false, message: err.message });
    }
};

//////// user can update his reply /////////////////////

exports.updateReply = async (req, res) => {
    try {
        const userId = req.user._id;
        const data = req.body;
        const { replyText } = data;
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;

        console.log(userId)

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found." });
        }


        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).send({ status: false, message: "Comment not found." });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).send({ status: false, message: "Reply not found." });
        }


        if (reply.userId.toString() !== userId.toString()) {
            return res.status(403).send({ status: false, message: "Permission denied." });
        }


        reply.replyText = replyText;


        await blog.save();

        return res.status(200).send({ status: true, message: "Reply updated successfully", data: reply });
    } catch (err) {


        res.status(500).send({ status: false, message: err.message });
    }
};

/////// user can delete his replies //////////////////

exports.deleteReply = async (req, res) => {
    try {
        const userId = req.user._id;
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;
        console.log(userId)
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found." });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).send({ status: false, message: "Comment not found." });
        }

        const reply = comment.replies.id(replyId);
        if (!reply) {
            return res.status(404).send({ status: false, message: "Reply not found." });
        }

        if (reply.userId.toString() !== userId.toString()) {
            return res.status(403).send({ status: false, message: "Permission denied." });
        }

        // Use .pull() to remove the reply subdocument
        comment.replies.pull(reply);

        await blog.save();

        return res.status(200).send({ status: true, message: "Reply deleted successfully" });
    } catch (err) {

        res.status(500).send({ status: false, message: err.message });
    }
};

/////////////// deleting comment with all associated replies ///////

exports.deleteComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const blogId = req.params.blogId;
        const commentId = req.params.commentId;

        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).send({ status: false, message: "Blog not found." });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).send({ status: false, message: "Comment not found." });
        }

        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).send({ status: false, message: "Permission denied." });
        }


        blog.comments.pull(comment);

        await blog.save();

        return res.status(200).send({ status: true, message: "Comment and its replies deleted successfully" });
    } catch (err) {

        res.status(500).send({ status: false, message: err.message });
    }
};
