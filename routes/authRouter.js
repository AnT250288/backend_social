const router = require('express').Router()
const authController = require('../controllers/authController')


router
    .post('/register', authController.register)
    .post('/login', authController.login)
    .post('/logout', authController.logout)
    .post('/refresh_token', authController.generateAccessToken)


module.exports = router