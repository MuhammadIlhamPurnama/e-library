const express = require('express')
const UserController = require('../controllers/userController')
const Router = express.Router()

Router.post('/register', UserController.register)
Router.post('/login', UserController.login)


module.exports = Router