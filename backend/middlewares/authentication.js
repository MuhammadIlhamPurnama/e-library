require('dotenv').config()
const jwt = require('jsonwebtoken')

const authentication  = async (req,res,next) => {
  try {
    const {authorization} = req.headers

    if (!authorization) {
      throw {name: "Unauthorized", message: "Invalid token"}
    }

    const rawToken = authorization.split(' ')
    const tokenType = rawToken[0]
    const tokenValue = rawToken[1]

    if (tokenType !== "Bearer" || !tokenValue) {
      throw {name: "Unauthorized", message: "Invalid token"}
    }

    const result = jwt.verify(tokenValue, process.env.JWT_SECRET)

    if (!result) {
      throw {name: "Unauthorized", message: "Invalid token"}
    }

    req.user = {id: result.id, role: result.role}

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = authentication;