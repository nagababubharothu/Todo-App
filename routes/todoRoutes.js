const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

// GET TODOS (CACHE)
router.get("/", auth, async (req, res) => {
    const redisClient = req.app.locals.redis;
    const key = `todos_${req.userId}`;

    // check cache
    const cached = await redisClient.get(key);

    if (cached) {
        console.log("From Redis ⚡");
        return res.json(JSON.parse(cached));
    }

    // fetch from MongoDB
    const todos = await Todo.find({ userId: req.userId });

    // store in redis
    await redisClient.setEx(key, 60, JSON.stringify(todos));

    console.log("From MongoDB 🗄️");
    res.json(todos);
});

// ADD TODO
router.post("/", auth, async (req, res) => {
    const redisClient = req.app.locals.redis;

    const todo = new Todo({
        task: req.body.task,
        userId: req.userId
    });

    await todo.save();

    // clear cache
    await redisClient.del(`todos_${req.userId}`);

    res.json(todo);
});

// DELETE TODO
router.delete("/:id", auth, async (req, res) => {
    const redisClient = req.app.locals.redis;

    await Todo.findByIdAndDelete(req.params.id);

    // clear cache
    await redisClient.del(`todos_${req.userId}`);

    res.json({ message: "Deleted" });
});

module.exports = router;