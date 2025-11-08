const express = require('express')
const FavoriteController = require('../controllers/favoriteController')
const authentication = require('../middlewares/authentication')
const isOwner = require('../middlewares/isOwner')
const Router = express.Router()

Router.get('/', authentication, FavoriteController.getFavorites)
Router.post('/', authentication, FavoriteController.addToFavorite)
Router.delete('/:id', authentication, isOwner, FavoriteController.removeFromFavorite)

module.exports = Router