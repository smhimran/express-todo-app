const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

// Middlewares
const isAuthenticated = require('../middlewares/authmiddleware')

const route = express.Router();

route.get('/', isAuthenticated, (req, res) => {
    User.findOne({ _id: req.userData.id })
    .populate("todos", "title description date -_id")
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err =>  {
        res.status(404).json(err)
    })
})

route.post("/signup", (req, res) => {
  User.find({ username: req.body.username }).then((user) => {
    if (user.length >= 1) {
      res.status(409).json({
        message: "A user with the username already exists!",
      });
    } else {
      bcrypt
        .hash(req.body.password, 10)
        .then((hashed) => {
          const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashed,
          });

          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: "User created successfully!",
              });
            })
            .catch((err) => {
              res.status(500).json({
                message: "Signup failed!",
              });
            });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Signup failed!",
          });
        });
    }
  });
});

route.post('/login', (req, res) => {
    User.find({ username: req.body.username })
    .then(user => {
        if (user.length < 1) {
            res.status(401).json({
                message: "Login failed!"
            })
        } else {
            bcrypt.compare(req.body.password, user[0].password)
            .then(result => {
                const token = jwt.sign({
                    id: user[0].id,
                    name: user[0].name,
                    username: user[0].username
                }, process.env.SECRET_KEY, {
                    expiresIn: '1h'
                })

                res.status(200).json({
                    message: "Login successful!",
                    access_token: token
                })
            })
            .catch(err => {
                console.log(err.message)
                res.status(401).json({
                    message: "Login failed!"
                })
            })
        }
    })
    .catch(err => {
        // console.log(err.message);
        res.status(401).json({
            message: "Login failed!"
        })
    })
})

module.exports = route;
