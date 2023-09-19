const mongoose = require("mongoose");
const objectId = mongoose.Schema.Types.ObjectId;

// ================== **This is what how our blog model will look like**==================================

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authorData',
        required: true
    },
    fullName: {
        type: String,
    },
    commentText: {
        type: String,
        required: true
    },
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'authorData',
                required: true
            },
            commentId: {
                type: mongoose.Schema.Types.ObjectId,
            },
            fullName: {
                type: String,
            },
            replyText: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'authorData',
        required: true
    },
    tags: [{
        type: String,
        lowercase: true
    }],
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    subcategory: mongoose.Schema.Types.Mixed,
    imageUrl: {
        public_Id: {
            type: String
        },
        url: {
            type: String
        }
    },
    comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
