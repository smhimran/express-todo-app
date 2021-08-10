const express = require('express')
const mongoose = require('mongoose')
const Todo = require('../models/todo')

const route = express.Router()

route.get('/', (req, res) => {
    Todo.find({})
    .exec()
    .then(docs => {
        res.status(200).json(docs)
    })
    .catch(error => {
        res.status(404).json(error)
    })
})

route.post('/', (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        done: false
    })

    todo.save()
    .then(result => {
        res.status(201).json(result)
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

route.get('/:id', (req, res) => {
    Todo.find({_id: req.params.id}).exec().then(docs => {
        res.status(200).json(docs)
    }).catch(error => {
        res.status(404).json(error)
    })
})

module.exports = route