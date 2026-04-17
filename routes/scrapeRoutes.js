const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/data", async (req, res) => {
    try {
        const response = await axios.get("https://example.com");
        const $ = cheerio.load(response.data);

        let results = [];

        $("h2").each((i, el) => {
            results.push($(el).text());
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Scraping failed" });
    }
});

module.exports = router;