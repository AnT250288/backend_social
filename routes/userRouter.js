const router = require('express').Router()
const auth = require('../middleware/auth')
const userController = require('../controllers/userController')

router
    .get('/search', auth, userController.searchUser)
    .get('/user/:id', auth, userController.getUser)
    .patch('/user', auth, userController.updateUser)
module.exports = router;

