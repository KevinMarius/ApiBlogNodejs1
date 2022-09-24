const mongoose = require('mongoose')
const Category = require('./category')
const User = require('./user')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: "Title is require",
        minLength: 3,
        maxLength: 150,
    },
    content: {
        type: String,
        required: "Content is require",
        minLength: 3,
        maxLength: 5000,
    },
    picture: {
        type: String,
    },
    state: {
        type: Boolean
    },
    category: {
        type: mongoose.Types.ObjectId, ref: "Category"
    },
    user: {
        type: mongoose.Types.ObjectId, ref: "User"
    }
}, { timestamps: true})

module.exports = mongoose.model("Post", postSchema)