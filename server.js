const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/data", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({ error: "URL is required" });
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let results = [];

        $("h1, h2, h3").each((i, el) => {
            results.push($(el).text());
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Scraping failed" });
    }
});

module.exports = router;