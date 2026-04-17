const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const redis = require("redis");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Redis
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.connect()
.then(() => console.log("Redis Connected"))
.catch(err => console.log("Redis Error:", err));

app.locals.redis = redisClient;

// Static
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Fix dashboard error
app.get("/dashboard.html", (req, res) => {
    res.redirect("/");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/scrape", scrapeRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});