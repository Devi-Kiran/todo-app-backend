const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todoTask: {
    type: String,
    required: true,
    // unique: true
  },
  completed: {
    type: Boolean,
    required: true,
    enum: [true, false]
  },
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;