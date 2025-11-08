const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const router = require('./routes')
const responseHandler = require('./middlewares/responseHandler')

app.use(express.json())
app.use(cors())
app.use(responseHandler)

app.use('/api', router)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app