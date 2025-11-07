const express = require('express')
const BookController = require('../controllers/bookController')
const Router = express.Router()

Router.get('/', BookController.getBooks)

module.exports = Router