const Users = require("../models/userModel")
const e = require("express");


const userController = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
                .limit(10).select("fullName username avatar")

            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findOne({_id: req.params.id})
                .select("-password")
            if (!user) {
                return res.status(400).json({msg: "User not exist"})
            }
            res.json({user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const {avatar, fullName, story, phone, address} = req.body
            if (!fullName) {
                return res.status(400).json({msg: "Full name is required"})
            }
            await Users.findOneAndUpdate({id: req.user._id}, {
                avatar, fullName, story, phone, address
            })
            res.json({msg: "Update success"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await Users.find({_id: req.params._id, friends: req.user._id})
            if (user.length > 0) {
                return res.status(500).json({msg: "You have already followed"})
            }

            await Users.findOneAndUpdate({_id: req.params.id}, {
                $push: {friends: req.user._id}
            }, {new: true})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {following: req.params.id}
            }, {new: true})


            res.json({msg: "You have new friend"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            await Users.findOneAndUpdate({_id: req.params.id}, {
                $pull: {friends: req.user._id}
            }, {new: true})

            await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {following: req.params.id}
            }, {new: true})


            res.json({msg: "You have new friend", user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = userController