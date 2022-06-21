const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            text: true,
        },
        username: {
            type: String,
            required: [true, "last name is required"],
            unique: true,
            trim: true,
            text: true,
        },
        email: {
            type: String,
            required: [true, "email name is required"],
            max: 50,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        address: {
            type: String,
            default: "",
        },
        gender: {
            type: String,
            default: 'male'
        },
        phone: {
            type: String,
            default: ''
        },
        story: {
            type: String,
            default: ''
        },
        avatar: {
            type: String,
            default: "https://cdn2.vectorstock.com/i/thumb-large/55/86/anonymous-icon-incognito-sign-privacy-vector-34705586.jpg",
        },
        coverPicture: {
            type: String,
            default: 'https://club.dns-shop.ru/api/v1/image/getOriginal/q93_e01c167a85d7712eba7c143431f6824145f0eb4199a5603ddadfd7e54273c4a1.jpg',
        },
        friends: [{type: mongoose.Types.ObjectId, ref: 'user'}],
        following: [{type: mongoose.Types.ObjectId, ref: 'user'}],
        friendRequests: [{type: mongoose.Types.ObjectId, ref: 'user'}],

    },

    {
        timestamps: true
    })

module.exports = mongoose.model('user', userSchema)