const Users = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validLength = require('../helpers/validation')


const authController = {
    register: async (req, res) => {
        try {
            const {fullName, username, email, password, gender} = req.body
            const newUserName = username.toLowerCase().replace(/ /g, '')
            const user_name = await Users.findOne({username: newUserName})
            if (user_name) {
                return res.status(400).json({msg: "User with this name already exist"})
            }
            const checkEmail = await Users.findOne({email: email})
            if (checkEmail) {
                return res.status(400).json({msg: "User with this email already exist"})
            }
            if (!validLength(password, 6, 20)) {
                return response.status(400).json({
                    msg: "Password must be between 6 and 20 symbols"
                })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new Users({
                fullName,
                username: newUserName,
                email,
                password: hashedPassword,
                gender
            })

            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: "/api/refresh_token",
                maxAge: 24 * 30 * 60 * 60 * 1000
            })

            await newUser.save()

            res.json({
                msg: "You successfully register in Social network",
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })

        } catch (err) {
            res.status(500).json({msg: err.msg})
        }
    },

    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})
                .populate("friends following", "-password")
            if (!user) {
                return res.status(400).json({msg: "No user with that email"})
            }
            const checkPassword = await bcrypt.compare(password, user.password)
            if (!checkPassword) {
                return res.status(400).json({msg: "Invalid password"})
            }

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: "/api/refresh_token",
                maxAge: 24 * 30 * 60 * 60 * 1000
            })


            res.json({
                msg: "You successfully login in Social network",
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })

        } catch (err) {
            res.status(500).json({msg: err.msg})
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: "/api/refresh_token"})
            res.json({msg: "Logged out"})
        } catch (err) {
            res.status(500).json({msg: err.msg})
        }
    },

    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) {
                return res.status(400).json({msg: "Please login!"})
            }

            jwt.verify(rf_token, process.env.REFRESHTOKEN, async (err, result) => {
                if (err) {
                    return res.status(400).json({msg: "Please, LogIn"})
                }
                const user = await Users.findById(result.id).select("-password").populate("friends following")

                if (!user) {
                    return res.status(400).json({msg: "User not exist"})
                }

                const access_token = createAccessToken({id: result.id})
                res.json({
                    access_token,
                    user
                })
            })
        } catch (err) {
            res.status(500).json({msg: err.msg})
        }
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESSTOKEN, {expiresIn: "1d"})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESHTOKEN, {expiresIn: "30d"})
}


module.exports = authController