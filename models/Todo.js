const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    task: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Todo", TodoSchema);