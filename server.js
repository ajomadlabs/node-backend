// Importing required modules
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'

// Defining port
const port = process.env.PORT || 9000

// Defining app
const app = express()

// Defining middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

// Defining the Routes
require('./routes/index')(app)

// Listening to port
app.listen(port)
console.log('Server running on:' + ' ' + 'http://localhost:' + port)

module.exports = app