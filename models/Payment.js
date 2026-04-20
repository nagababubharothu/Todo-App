const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    userId: String,
    product: String,
    amount: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);