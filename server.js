const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const redis = require("redis");

// Routes
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const scrapeRoutes = require("./routes/scrapeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= REDIS =================
const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisClient.connect()
.then(() => console.log("Redis Connected"))
.catch(err => console.log("Redis Error:", err));

// Make redis globally available
app.locals.redis = redisClient;

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "public")));

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Fix dashboard error
app.get("/dashboard.html", (req, res) => {
    res.redirect("/");
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/scrape", scrapeRoutes);

// ================= MONGODB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("Mongo Error:", err));

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

// ================= GLOBAL ERROR HANDLING =================
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
});