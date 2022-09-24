const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name is require",
        minLength: 3,
        maxLength: 150,
    },
    surname: {
        type: String,
        required: "Surname is require",
        minLength: 3,
        maxLength: 150,
    },
    dateBorn: {
        type: Date,
    },
    email: {
        type: String,
        required: "Email is require",
        minLength: 3,
        maxLength: 150,
    },
    password: {
        type: String,
        required: "Password is require",
        minLength: 3,
        maxLength: 255,
    },
    phone: {
        type: String,
        required: "Phone is require",
        minLength: 3,
        maxLength: 150,
    },
    picture: {
        type: String,
    },
    role: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)