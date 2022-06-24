const router = require('express').Router()
const auth = require('../middleware/auth')
const userController = require('../controllers/userController')

router
    .get('/search', auth, userController.searchUser)
    .get('/user/:id', auth, userController.getUser)
    .patch('/user/:id', auth, userController.updateUser)
    .patch('/user/:id/friend', auth, userController.follow)
    .patch('/user/:id/unfollow', auth, userController.unfollow)
module.exports = router;

