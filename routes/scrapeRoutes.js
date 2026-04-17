const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

router.get("/data", async (req, res) => {
    try {
        let url = req.query.url;

        // ✅ default URL if not provided
        if (!url || url.trim() === "") {
            url = "https://news.ycombinator.com";
        }

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let results = [];

        $("h1, h2, h3").each((i, el) => {
            results.push($(el).text());
        });

        // ✅ avoid empty crash
        if (results.length === 0) {
            results.push("No data found");
        }

        res.json(results);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Scraping failed" });
    }
});

module.exports = router;