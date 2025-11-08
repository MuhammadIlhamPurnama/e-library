const express = require('express')
const BookController = require('../controllers/bookController')
const isAdmin = require('../middlewares/isAdmin')
const authentication = require('../middlewares/authentication')
const Router = express.Router()
const multer = require('multer')

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp']

const storage = multer.memoryStorage()
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'), false)
  }
}
const upload = multer({ storage, limits: {fileSize: MAX_FILE_SIZE}, fileFilter })

Router.get('/', BookController.getBooks)
Router.get('/:id', BookController.getBookById)
Router.post('/', authentication, isAdmin, upload.single('imageUrl'), BookController.addBook)

module.exports = Router