const { Favorite, Book } = require('../models')

class FavoriteController {
  static async getFavorites (req,res,next) {
    try {
      let { page = 1, limit = 10 } = req.query
      page = +page
      limit = +limit
      if (page < 1) page = 1
      if (limit < 1) limit = 10

      const offset = (page - 1) * limit

      const where = { userId: req.user.id }

      const { rows: favorites, count: totalItems } = await Favorite.findAndCountAll({
        where,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Book,
            as: 'Book',
          }
        ]
      })

      const totalPages = Math.ceil(totalItems / limit)

      const data = {
        favorites,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit
        }
      }

      res.success('Successfully get favorites', data, 200)
    } catch (error) {
      next(error)
    }
  }

  static async addToFavorite (req,res,next) {
    try {
      const bookId = req.body.bookId
      if (!bookId) {
        throw { name: 'BadRequest', message: 'bookId is required' }
      }

      const book = await Book.findByPk(bookId)
      if (!book) {
        throw { name: 'NotFound', message: 'Book not found' }
      }

      const existing = await Favorite.findOne({
        where: {
          userId: req.user.id,
          bookId: bookId
        }
      })

      if (existing) {
        throw { name: 'BadRequest', message: 'Book already in favorites' }
      }

      const favorite = await Favorite.create({
        userId: req.user.id,
        bookId: bookId
      })

      res.success('Successfully added to favorites', favorite, 201)
    } catch (error) {
      next(error)
    }
  }

  static async removeFromFavorite (req, res, next) {
    try {
      const {id} = req.params

      const favorite = await Favorite.findByPk(id)

      if (!favorite) {
        throw { name: 'NotFound', message: 'Favorite not found' }
      }

      await favorite.destroy()

      res.success('Successfully removed from favorites', null, 200)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = FavoriteController