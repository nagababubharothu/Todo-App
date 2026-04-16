const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= STATIC FILES ================= */
app.use(express.static(path.join(__dirname, "public")));

/* ================= ROUTES ================= */

// Home → login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Auth routes
app.use("/api/auth", authRoutes);

// Todo routes
app.use("/api/todos", todoRoutes);

/* ================= DATABASE ================= */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.log("❌ MONGO_URI not found. Check .env file");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
    console.log("❌ DB Error:", err);
    process.exit(1);
});

/* ================= PORT ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});