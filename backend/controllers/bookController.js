const { Op } = require('sequelize');
const {Book} = require('../models')

class BookController {
  static async getBooks(req, res, next) {
    try {
      let {page = 1, limit = 10, sort, search} = req.query

      page = +page;
      limit = +limit;

      const offset = (page - 1) * limit

      let queryOption = {
        limit,
        offset,
        where: {},
        order: []
      }

      // === SORT ===
      if (sort && typeof sort === "string") {
        if (sort.charAt(0) === "-") {
          queryOption.order.push([sort.slice(1), "DESC"])
        } else {
          queryOption.order.push([sort, "ASC"])
        }
      } else {
        queryOption.order.push(["createdAt", "DESC"])
      }

      // === SEARCH === (by name or description)
      if (search) {
        queryOption.where[Op.or] = [
          {
            bookName: {
              [Op.iLike]: `%${search}%`
            }
          }
        ]
      }

      const { rows: books, count: totalItems } = await Book.findAndCountAll(queryOption)

      const totalPages = Math.ceil(totalItems / limit)

      const data = {
        books,
         pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit
        }
      }

      res.success("Successfully get books data", data, 200)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = BookController