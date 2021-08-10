// Dependencies
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')

// Routes
const todoRoute = require('./routes/todo')

const app = express()

const port = 5000

// Connect to database
mongoose.connect('mongodb://localhost/todo-app', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(msg => {
        console.log('Connected to the database successfully!')
    })
    .catch(err => console.log(err.message))

app.use(logger('dev'))
app.use(express.json())

// Routes
app.use('/todo', todoRoute)

app.get('/', (req, res) => {
    res.status(200).json({
        data: req.body.data,
        message: "Hello World!"
    })
})

app.listen(port, () => {
    console.log('Server running at port 5000')
})