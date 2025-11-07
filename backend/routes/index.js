const express = require('express')
const Router = express.Router()
const userRouter = require('./user')
const bookRouter = require('./book')

Router.use('/', userRouter)
Router.use('/books', bookRouter)

module.exports = Router