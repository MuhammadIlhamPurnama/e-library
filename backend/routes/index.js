const express = require('express')
const Router = express.Router()
const userRouter = require('./user')

Router.use('/', userRouter)

module.exports = Router