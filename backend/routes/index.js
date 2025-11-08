const express = require('express')
const Router = express.Router()
const userRouter = require('./user')
const bookRouter = require('./book')
const favoriteRouter = require('./favorite')
const authentication = require('../middlewares/authentication')
const UserController = require('../controllers/userController')

Router.use('/', userRouter)
Router.use('/books', bookRouter)
Router.use('/favorites', favoriteRouter)
Router.get('/profile', authentication, UserController.getProfile)


module.exports = Router