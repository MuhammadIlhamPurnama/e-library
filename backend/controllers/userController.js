const {User} = require('../models')

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
}

module.exports = UserController