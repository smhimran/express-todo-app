// Dependencies
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require('dotenv')

// Routes
const userRoute = require("./routes/user");
const todoRoute = require("./routes/todo");

const app = express();

dotenv.config()

const port = 5000;

// Connect to database
mongoose
  .connect("mongodb://localhost/todo-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((msg) => {
    console.log("Connected to the database successfully!");
  })
  .catch((err) => console.log(err.message));

app.use(logger("dev"));
app.use(express.json());

// Routes
app.use("/user", userRoute);
app.use("/todo", todoRoute);

app.all("*", (req, res, next) => {
  const error = new Error(
    `The requested url ${req.originalUrl} was not found in the server!`
  );
  error.statusCode = 404;
  error.status = "Not found!";

  next(error);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Server error!";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log("Server running at port 5000");
});
