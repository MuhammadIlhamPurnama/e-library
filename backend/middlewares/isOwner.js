const {Favorite} = require("../models")

const isOwner = async (req, res, next) => {
  try {
    let {id} = req.params

    const favorite = await Favorite.findByPk(id)
    
    if (!favorite) {
      throw {name: "NotFound", message: "Error Not Found"}
    }

  
    if (req.user.id === favorite.userId) {
      return next()
    }

    throw {name : "Forbidden", message: "You are not authorized"}
  } catch (error) {
    next(error)
  }
}

module.exports = isOwner