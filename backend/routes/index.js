const express = require('express')
const Router = express.Router()
const userRouter = require('./user')
const bookRouter = require('./book')
const favoriteRouter = require('./favorite')

Router.use('/', userRouter)
Router.use('/books', bookRouter)
Router.use('/favorites', favoriteRouter)


module.exports = Router