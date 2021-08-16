const express = require("express");
const Todo = require("../models/todo");

const route = express.Router();

route.get("/", (req, res) => {
  if (!!req.query.word) {
    const word = req.query.word
    Todo.find().byWord(word)
    .select({
        // _id: 0,
        done: 0,
        __v: 0,
      })
    .then(docs => {
      res.status(200).json(docs)
    })
    .catch(err => {
      res.status(404).json(docs)
    })
  }
  else {
    Todo.find({})
      .select({
        // _id: 0,
        done: 0,
        __v: 0,
      })
      .exec()
      .then((docs) => {
        res.status(200).json(docs);
      })
      .catch((error) => {
        res.status(404).json(error);
      });
  }
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

route.get("/active", (req, res) => {
  const todo = new Todo();
  todo.findActive()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json(err.message);
    });
});

route.get('/findReact', (req, res) => {
  Todo.findReact()
  .then(docs => {
    res.status(200).json(docs)
  })
  .catch(err => {
    res.status(500).json(err)
  })
})

route.get("/:id", (req, res) => {
  Todo.findById({ _id: req.params.id })
    .exec()
    .then((docs) => {
      if (docs) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: "The requested item was not found!",
        });
      }
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

route.put("/:id", (req, res) => {
  Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        ...req.body,
      },
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

route.delete("/:id", (req, res) => {
  Todo.deleteOne({ _id: req.params.id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = route;
