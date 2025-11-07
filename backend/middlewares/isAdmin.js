const isAdmin = async (req,res,next) => {
  try {
    const {role} = req.user

    if (role === 'Admin') {
      return next()
    }

    throw {name: "Forbidden", message: "You are not authorized"}
  } catch (error) {
    next(error)
  }
}

module.exports = isAdmin