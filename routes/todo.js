const express = require("express");
const Todo = require("../models/todo");

const route = express.Router();

route.get("/", (req, res) => {
  Todo.find({}).select({
    _id: 0,
    done: 0,
    __v: 0
  })
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

route.post("/", (req, res) => {
  const todo = new Todo(req.body);

  todo
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

route.get("/:id", (req, res) => {
  Todo.find({ _id: req.params.id })
    .exec()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

route.put('/:id', (req, res) => {
  Todo.findByIdAndUpdate({_id: req.params.id}, {
    $set: {
      ...req.body
    }, 
    
  },
  {
    new: true,
    useFindAndModify: false
  }
  ).then(result => {
    res.status(200).json(result)
  }).catch(err => {
    res.status(500).json(err)
  })
})

module.exports = route;
