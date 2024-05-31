const express = require("express");
const mongoose = require("mongoose");
var cors = require('cors');
require('dotenv').config();

const Todo = require("./models/todo");

const app = express();

const uri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database successfully"))
  .catch((error) => {
    console.error("Something went wrong, did not connect to the database", error);
    process.exit(1); // Exit process with failure
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).send("<h1>Hello KA</h1>");
});

app.get("/todoes", async (req, res) => {
  try {
    const todoes = await Todo.find();
    res.status(200).json(todoes);
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

app.get("/todoes/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo Not Found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

app.post("/todoes", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

app.patch("/todoes/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }
    res.status(200).json({ message: "Todo Updated Successfully", todo: updatedTodo });
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

app.delete("/todoes/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo Not Found" });
    }
    res.status(200).json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ error: "Something Went Wrong" });
  }
});

// Start server
app.listen(9000, () => {
  console.log(`App is running on http://localhost:9000`);
});

