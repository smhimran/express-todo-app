const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    done: Boolean
})

module.exports = mongoose.model('Todo', todoSchema)