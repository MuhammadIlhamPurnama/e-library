const { Op } = require('sequelize');
const {Book} = require('../models')
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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

  static async getBookById(req,res,next) {
    try {
      const {id} = req.params

      const data = await Book.findByPk(id) 

      if (!data) {
        throw {name:'NotFound', message:"Book not found"}
      }

      res.success('Successfully get book', data, 200)
    } catch (error) {
      next(error)
    }
  }

  static async addBook(req,res,next) {
    try {
      const {bookName, description} = req.body

      if (!req.file) {
        throw { name: "BadRequest", message: "Image file is required" }
      }

      const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp']
      const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

      if (!ALLOWED_MIMETYPES.includes(req.file.mimetype)) {
        throw { name: "BadRequest", message: "Invalid image type" }
      }

      if (req.file.size > MAX_FILE_SIZE) {
        throw { name: "BadRequest", message: "Image size exceeds 2 MB" }
      }
      
      const uploadPromise = new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, uploadResult) => {
          
          if (error) return reject(error) 
          
          return resolve(uploadResult);
        }).end(req.file.buffer);
      })

      const uploadResult = await uploadPromise;

      const book = await Book.create({bookName, description, imageUrl: uploadResult.secure_url})

      res.success("Successfully created book", book, 201)

    } catch (error) {
      next(error)
    }
  }
}

module.exports = BookController