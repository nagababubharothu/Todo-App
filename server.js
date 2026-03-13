const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(express.static("public"));

const todoRoutes = require("./routes/todoRoutes");
app.use("/api/todos", todoRoutes);

/* ✅ ADD THIS CODE */
app.get("/", (req, res) => {
    res.redirect("/login.html");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});