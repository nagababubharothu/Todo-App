const express = require("express");
const router = express.Router();

router.post("/pay", (req, res) => {
    const { amount } = req.body;

    res.json({
        status: "success",
        message: "Payment successful",
        amount
    });
});

module.exports = router;