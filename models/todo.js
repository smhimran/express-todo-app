const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

// instance methods
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo", todoSchema).find({ status: "active" });
  },
};

// static methods
todoSchema.statics = {
  findReact: function () {
    return this.find({ title: /react/gi });
  },
};

// Query helpers
todoSchema.query = {
  byWord: function (word) {
    return this.find({ title: new RegExp(word, "gi") });
  },
};

module.exports = mongoose.model("Todo", todoSchema);
