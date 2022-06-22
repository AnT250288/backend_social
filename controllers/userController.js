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
            const {fullName, story, phone, address} = req.body
            if(!fullName){
                return res.status(500).json({msg: "Full name is required"})
            }

            await Users.findByIdAndUpdate({_id: req.user},{
                fullName, story, phone, address
            })

            res.json({msg: "update success"})
        } catch (err){
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = userController