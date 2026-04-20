const express = require("express");
const router = express.Router();

// Dummy payment save
router.post("/pay", (req, res) => {
    const { amount, cart } = req.body;

    console.log("Payment:", amount, cart);

    res.json({
        status: "success",
        message: "Payment successful",
        amount
    });
});

module.exports = router;