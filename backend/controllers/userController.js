require('dotenv').config()
const {User} = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController {
  static async register(req, res, next) {
    try {
      const {email, password} = req.body;

      const user = await User.create({email, password, role:"User"})
      delete user.dataValues.password

      return res.success("Successfully registered user", user, 201)
    } catch (error) {
      next(error)
    }
  }

  static async login (req,res,next) {
    try {
      const {email, password} = req.body

      if (!email) {
        throw {name: "BadRequest", message: "Email is required."}
      }

      if (!password) {
        throw {name: "BadRequest", message: "Password is required."}
      }

      const user = await User.findOne({where: {email}})

      if (!user) {
        throw {name: "Unauthorized", message: "Invalid email/password"}
      }

      const verifyPassword = bcrypt.compareSync(password, user.password)

      if (!verifyPassword) {
        throw {name: "Unauthorized", message: "Invalid email/password"}
      }

      const access_token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET)

      res.success("Login Success", access_token, 200)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController