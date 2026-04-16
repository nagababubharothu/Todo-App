const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// GET TODOS (only user)
router.get("/", auth, async (req, res) => {
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
});

// ADD TODO
router.post("/", auth, async (req, res) => {
    const todo = new Todo({
        task: req.body.task,
        userId: req.userId
    });

    await todo.save();
    res.json(todo);
});

// DELETE TODO
router.delete("/:id", auth, async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;