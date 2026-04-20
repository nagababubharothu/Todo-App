const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const redis = require("redis");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const scrapeRoutes = require("./routes/scrapeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// REDIS
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.connect()
.then(() => console.log("Redis Connected"))
.catch(err => console.log(err));

app.locals.redis = redisClient;

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/scrape", scrapeRoutes);
app.use("/api/payment", paymentRoutes);

// MONGODB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});